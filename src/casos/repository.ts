
import mongoose from 'mongoose';
import axios from "axios";
import { casoVirusSchema, Actualizacion, casosReportSchema, PercentageModel, CurvaPaisModel, curvasSchema, actualizacionesSchema } from './models';
import { addDias } from "fechas";


const log = console.log;

/**
 * @param new_caso 
 * Ingresa una nueva actualización en MongoDB
 */
export const ingresaActualizacionInDB = async (new_caso: Actualizacion) => {
    try {

        const URI_MONGO: string = process.env.MONGODB_URI || '';
        await mongoose.connect(URI_MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
        const Caso = mongoose.model('actualizaciones', actualizacionesSchema);

        const caso = new Caso({
            Lugar: new_caso.Lugar,
            Contagiados: new_caso.Contagiados,
            Decesos: new_caso.Decesos,
            Actualizado: new_caso.Actualizado
        });
        await caso.save();
    } catch (error) {
        console.log("Error: {ingresaActualizacionInDB} - ", error.message);
        ingresaActualizacionInDB(new_caso);
    }
}


/**
 * @param country
 * Busca en MongoDB las actualizaciones ya ingresadas por un pais o lugar dado
 */
export const getCasoByCountryInDB = async (country: string) => {
    try {

        const URI_MONGO: string = process.env.MONGODB_URI || '';
        await mongoose.connect(URI_MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
        const Caso = mongoose.model('actualizaciones', actualizacionesSchema);

        const first = country.substr(0, 1);
        country = country.replace(first, first.toUpperCase());
        const result: any[] = await Caso.find({ "Lugar": country.trim() });

        if (typeof result === "undefined") { throw new Error("Ninguna coincidencia de busqueda"); }

        return result;

    } catch (error) {
        getCasoByCountryInDB(country);
        console.log('Error: {getCasoByCountryInDB} - ', error.message);
    }
}



let nuevosCasos: any[] = [];
let nuevosCasosModificados: any[] = [];
/**
 *  Consulta una API externa (fuente descnocida) con datos actualizados del COVID y contrasta con los datos en MongoDB para saber si hay nuevos decesos o contagiados
 */
export const populateCases = async () => {
    console.time();
    log('Se inicia proceso de población de datos at ', new Date().toLocaleString());
    const URL_API_CORONA = process.env.URL_API_CORONA || '';

    try {
        const responseAPi = await axios.get(URL_API_CORONA);
        if (typeof responseAPi === "undefined") { throw new Error("API sin data") }
        const streamData: any[] = responseAPi.data.feed.entry;

        for (const item of streamData) {
            const casoAPI: Actualizacion = {
                Lugar: item.gsx$country.$t || '',
                Contagiados: Number.parseInt(item.gsx$confirmedcases.$t.replace(',', '')),
                Decesos: item.gsx$reporteddeaths.$t === '' ? 0 : Number.parseInt(item.gsx$reporteddeaths.$t.replace(',', '')),
                Actualizado: item.updated.$t || ''
            };

            casoAPI.Lugar.trim();
            log(`Evaluamos ${casoAPI.Lugar}:`);
            await registraSiNuevosCasos(casoAPI);
        }

        log('proceso finalizado a las ', new Date().toLocaleString());
        log({ nuevosLugaresMundo: nuevosCasos, actualizacionCasos: nuevosCasosModificados })
        return;

    } catch (error) { console.log(error.message); }

}


/**
 * 
 * @param casoAPI 
 * Contrasta datos de Covid con la ultima actualizacion ingresada en Mongo y pobla datos
 */
const registraSiNuevosCasos = async (casoAPI: Actualizacion) => {

    const casosLugarInDatabase = await getCasoByCountryInDB(casoAPI.Lugar);

    if (typeof casosLugarInDatabase === "undefined" || casosLugarInDatabase.length === 0) {
        log(`...nuevo lugar encontrado: ${casoAPI.Lugar}`);
        nuevosCasos = [...nuevosCasos, casoAPI.Lugar];
        await ingresaActualizacionInDB(casoAPI);
        return;
    }

    let ultimaFechaActualizacion: string = casosLugarInDatabase[0].Actualizado;
    let fechaActualizacionAPI: Date = new Date(casosLugarInDatabase[0].Actualizado);

    // casosLugarInDatabase.forEach(casoDB => {    
    //     if (new Date(casoDB.Actualizado) > fechaActualizacionAPI ){
    //         ultimaFechaActualizacion = casoDB.Actualizado;
    //     }
    // });

    ultimaFechaActualizacion = casosLugarInDatabase.reduce((acc, curr) => new Date(curr.Actualizado) > fechaActualizacionAPI ? curr.Actualizado : ultimaFechaActualizacion)

    const { Contagiados, Decesos } = casosLugarInDatabase.find(caso => caso.Actualizado === ultimaFechaActualizacion);

    if ((casoAPI.Contagiados !== Contagiados) || (casoAPI.Decesos !== Decesos)) {
        const contagiados = casoAPI.Contagiados !== Contagiados ? (casoAPI.Contagiados - Contagiados) : 0;
        const decesos = casoAPI.Decesos !== Decesos ? (casoAPI.Decesos - Decesos) : 0;

        let glosa: string = '';
        if (contagiados !== 0) {
            glosa = `+${contagiados} contagiados`;
        }
        if (decesos !== 0) {
            glosa = glosa.length > 0 ? glosa + ` y +${decesos} decesos` : ` +${decesos} decesos`;
        }

        log(`...actualizacion encontrada en: ${casoAPI.Lugar} (${glosa})`)
        nuevosCasosModificados = [...nuevosCasosModificados, { "Lugar": casoAPI.Lugar, "Actualizacion": glosa }];
        await ingresaActualizacionInDB(casoAPI);
    }

    return;
}


export const getCasesReport = async () => {
    try {
        const URI_MONGO: string = process.env.MONGODB_URI || '';
        await mongoose.connect(URI_MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
        const CasosReport = mongoose.model('CasosReport', casosReportSchema);
        const casosRepoty: any[] = await CasosReport.find();

        return casosRepoty;
    } catch (error) {
        log(error.messages);
        getCasesReport();
    }
}


export const geCurvaByCountryInDB = async (country: string) => {
    try {

        const URI_MONGO: string = process.env.MONGODB_URI || '';
        await mongoose.connect(URI_MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
        const CurvaContag = mongoose.model('datos_curvas', curvasSchema);

        const first = country.substr(0, 1);
        country = country.replace(first, first.toUpperCase());
        const result: any[] = await CurvaContag.find({ "lugar": country });
        if (typeof result === "undefined") { throw new Error("Ninguna coincidencia de busqueda"); }
        return result;
    } catch (error) {
        geCurvaByCountryInDB(country);
        console.log('Error: {geCurvaByCountryInDB} - ', error.message);
    }
}





const truncateCaseReport = async () => {
    try {
        const CasosReport = mongoose.model('CasosReport', casosReportSchema);
        log('- inicia truncate de casos-report...')
        const { deletedCount } = await CasosReport.collection.deleteMany({});
        if (deletedCount && deletedCount > 0) {
            log('colletion truncada OK.')
            return true;
        } else {
            log('problemas al truncar colletion.')
            return false;
        }
    } catch (error) {
        log('error - {truncateCaseReport}: ', error.message)
        truncateCaseReport();
    }
}

const truncateCollCurvas = async () => {
    try {
        const CurvaContagios = mongoose.model('datos_curvas', curvasSchema);
        log('- inicia truncate de curvas...')
        const { deletedCount } = await CurvaContagios.collection.deleteMany({});
        if (deletedCount && deletedCount > 0) {
            log('colletion truncada OK.')
            return true;
        } else {
            log('problemas al truncar colletion.')
            return false;
        }
    } catch (error) {
        log('error - {truncateCollCurvas}: ', error.message)
        truncateCollCurvas();
    }
}

export const getListCases = async () => {
    try {
        const Casos = mongoose.model('actualizaciones', actualizacionesSchema);
        log('- inicia consulta de casos...')
        const casosAll: any[] = await Casos.find();
        let pses: string[] = [];
        casosAll.map(x => pses.push(x.Lugar.trim()));
        const paises = [...new Set(pses)];
        log('consulta de casos OK.')
        return { paises, casosAll };
    } catch (error) {
        log('error - {getListCases}: ', error.message)
        getListCases();
    }
}

function horasToTiempoGlosa(hrs: number) {
    const dias = Math.floor(hrs / 24);
    const horas = Math.floor(hrs % 24);
    if (dias === 0 && horas > 0) return `${horas.toFixed(0)}h`;
    if (dias > 0 && horas === 0) return `${dias.toFixed(0)}d`;
    if (dias > 0 && horas > 0) return `${dias.toFixed(0)}d ${horas.toFixed(0)}h`
}

// const datosGlobales = async() => {

//     const URL_API_CORONA = process.env.URL_API_CORONA||'';
//     const responseAPi = await axios.get(URL_API_CORONA);
//     if (typeof responseAPi === "undefined") { throw new Error("API sin data") }
//     const streamData: any[] = responseAPi.data.feed.entry;

//     const totalContagiados = streamData.reduce((acc, val) => acc + Number.parseInt(val.gsx$confirmedcases.$t.replace(',','')), 0);
//     const totalDecesos = streamData.reduce((acc, val) => acc + (val.gsx$reporteddeaths.$t === '' ? 0 : Number.parseInt(val.gsx$reporteddeaths.$t.replace(',',''))), 0);
//     return { totalContagiados, totalDecesos };
// }

const calcCurvaContagiados = (casos: Actualizacion[]): CurvaPaisModel[] => {

    let listaDiferencias: CurvaPaisModel[] = [];
    let curvaContagiosPorDia: CurvaPaisModel[] = [];
    const fechasInformadas = casos.map(data => new Date(data.Actualizado).toISOString().slice(0, 10).replace(/[-]/g, '/'));
    const fechasInformadasPorDia = [...new Set(fechasInformadas)];
    for (const [idx, caso] of casos.entries()) {
        const fechaCorta = new Date(caso.Actualizado).toISOString().slice(0, 10).replace(/[-]/g, '/');
        if (idx > 0) {
            listaDiferencias.push({ valor: caso.Contagiados - casos[idx - 1].Contagiados, fecha: fechaCorta });
        }
    }
    fechasInformadasPorDia.map(fecha => {
        const nroContagios = listaDiferencias.filter(filtrados => filtrados.fecha === fecha).reduce((acc, val) => acc + val.valor, 0);
        curvaContagiosPorDia.push({ valor: nroContagios, fecha });
    });

    return curvaContagiosPorDia;

}

const calcCurvaDecesos = (casos: Actualizacion[]): CurvaPaisModel[] => {

    let listaDiferencias: CurvaPaisModel[] = [];
    let curvaDecesosPorDia: CurvaPaisModel[] = [];
    const fechasInformadas = casos.map(data => new Date(data.Actualizado).toISOString().slice(0, 10).replace(/[-]/g, '/'));
    const fechasInformadasPorDia = [...new Set(fechasInformadas)];
    for (const [idx, caso] of casos.entries()) {
        const fechaCorta = new Date(caso.Actualizado).toISOString().slice(0, 10).replace(/[-]/g, '/');
        if (idx > 0) {
            listaDiferencias.push({ valor: caso.Decesos - casos[idx - 1].Decesos, fecha: fechaCorta });
        }
    }
    fechasInformadasPorDia.map(fecha => {
        const nroDecesos = listaDiferencias.filter(filtrados => filtrados.fecha === fecha).reduce((acc, val) => acc + val.valor, 0);
        curvaDecesosPorDia.push({ valor: nroDecesos, fecha });
    });

    return curvaDecesosPorDia;

}


export const populateReport = async () => {
    try {
        const URI_MONGO: string = process.env.MONGODB_URI || '';
        await mongoose.connect(URI_MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
        const CasosReport = mongoose.model('CasosReport', casosReportSchema);
        const Curvas = mongoose.model('datos_curvas', curvasSchema);

        log('--- INICIO poblacion de report ---')
        const { ...vars } = await getListCases();

        if (vars.paises.length >= 0 && vars.casosAll.length >= 0) {
            await truncateCaseReport();
            await truncateCollCurvas();
        }

        // const curvaContagPromise: Promise<any>;
        vars.paises.map(async (pais) => {

            let casosReport;
            const arrayLug: Actualizacion[] = vars.casosAll.filter(cas => cas.Lugar === pais);
            const { Contagiados: contagiados_1, Lugar, Decesos: Decesos_1, Actualizado } = arrayLug[arrayLug.length - 1];

            const curvaContagDB = new Curvas({
                lugar: pais.trim(),
                curvaContagios: calcCurvaContagiados(arrayLug),
                curvaDecesos: calcCurvaDecesos(arrayLug)
            });

            if (arrayLug.length > 1) {

                const { Contagiados: contagiados_2, Decesos: decesos_2, Actualizado: actAnt } = arrayLug[arrayLug.length - 2];
                const horas = Math.floor(Math.abs(new Date(Actualizado).getTime() - new Date(actAnt).getTime()) / 36e5);

                let contagiados_3 = 0;
                let decesos_3 = 0;
                if (arrayLug.length > 2) {
                    const obj = arrayLug[arrayLug.length - 3];
                    contagiados_3 = obj.Contagiados;
                    decesos_3 = obj.Decesos;
                }

                let percentages: PercentageModel[] = [];
                arrayLug.map(caso => {
                    const percent: PercentageModel = {
                        Fecha: caso.Actualizado,
                        percent: ((caso.Decesos / caso.Contagiados) * 100).toFixed(1)
                    }; percentages.push(percent);
                });

                casosReport = new CasosReport({
                    lugar: Lugar.trim(),
                    totalContagiados: contagiados_1,
                    totalDecesos: Decesos_1,
                    porcent: ((Decesos_1 / contagiados_1) * 100).toFixed(1),
                    ultContagiados: (contagiados_1 - contagiados_2),
                    statusContagiados: contagiados_3 > 0 ? ((contagiados_1 - contagiados_2) > (contagiados_2 - contagiados_3)) ? 'SUBE' : 'BAJA' : '',
                    nroContagiadosAnt: contagiados_3 > 0 ? (contagiados_2 - contagiados_3) : 0,
                    ultDecesos: (Decesos_1 - decesos_2),
                    statusDecesos: decesos_3 > 0 ? ((Decesos_1 - decesos_2) > (decesos_2 - decesos_3)) ? 'SUBE' : 'BAJA' : '',
                    nroDecesosAnt: decesos_3 > 0 ? (decesos_2 - decesos_3) : 0,
                    tiempoDesdeUltAct: horasToTiempoGlosa(horas),
                    percentages,
                    fechUltActualizacion: Actualizado
                });
            }
            else {
                casosReport = new CasosReport({
                    lugar: Lugar.trim(),
                    totalContagiados: contagiados_1,
                    totalDecesos: Decesos_1,
                    porcent: ((Decesos_1 / contagiados_1) * 100).toFixed(1),
                    ultContagiados: 0,
                    statusContagiados: 0,
                    nroContagiadosAnt: 0,
                    ultDecesos: 0,
                    statusDecesos: 0,
                    nroDecesosAnt: 0,
                    tiempoDesdeUltAct: 0,
                    percentages: [],
                    fechUltActualizacion: Actualizado
                });
            }
            await casosReport.save();
            await curvaContagDB.save();
        });
        
        log('--- FINALIZA poblacion de report ---')
        return

    } catch (error) {
        log('error en populate: ', error)
    }

}



export const getCorrigeLugares = async () => {
    try {
        const URI_MONGO: string = process.env.MONGODB_URI || '';
        await mongoose.connect(URI_MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
        const Casos = mongoose.model('Casos', casoVirusSchema);
        const Actualizacion = mongoose.model('actualizaciones', actualizacionesSchema);
        log('- inicia consulta de casos...')
        const casosAll: any[] = await Casos.find();
        log('- fin consulta de casos...')

        casosAll.map(async (act) => {
            const newActualizacion = new Actualizacion({
                Lugar: act.Lugar.trim(),
                Contagiados: act.Contagiados,
                Decesos: act.Decesos,
                Actualizado: act.Actualizado
            });
            log('insertando .. ', act.Lugar.trim());
            await newActualizacion.save();

        });
        log('terminado: ', casosAll.length)
        return;
    } catch (error) {
        log('error - {getListCases}')
        getListCases();
    }
}


