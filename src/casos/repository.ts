
import mongoose from 'mongoose';
import axios from "axios";
import { casoVirusSchema, Actualizacion, casosReportSchema, ResponseListCases, PercentageModel, CurvaContagiadosModel, curvaContagSchema } from './models';
import { addDias } from "fechas";


const log = console.log;

/**
 * @param new_caso 
 * Ingresa una nueva actualización en MongoDB
 */
export const ingresaActualizacionInDB = async(new_caso: Actualizacion) => {
    try {

        const URI_MONGO: string = process.env.MONGODB_URI || '';
        await mongoose.connect(URI_MONGO, {useNewUrlParser: true, useUnifiedTopology: true} );
        const Caso = mongoose.model('Casos', casoVirusSchema);
    
        const caso = new Caso({ 
            Lugar: new_caso.Lugar,
            Contagiados: new_caso.Contagiados,
            Decesos: new_caso.Decesos,
            Actualizado: new_caso.Actualizado
        });
        await caso.save();
    } catch (error) { 
        console.log("Error: {ingresaActualizacionInDB} - ",error.message);
        ingresaActualizacionInDB(new_caso);
    }
}


/**
 * @param country
 * Busca en MongoDB las actualizaciones ya ingresadas por un pais o lugar dado
 */
export const getCasoByCountryInDB = async(country: string) => {
    try {
        
        const URI_MONGO: string = process.env.MONGODB_URI ||'';
        await mongoose.connect(URI_MONGO, {useNewUrlParser: true, useUnifiedTopology: true} );
        const Caso = mongoose.model('Casos', casoVirusSchema);

        const first = country.substr(0,1);
        country = country.replace(first, first.toUpperCase());
        const result: any[] = await Caso.find({"Lugar": country});
        
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
    log('Se inicia proceso de población de datos at ', new Date().toLocaleString() );
    const URL_API_CORONA = process.env.URL_API_CORONA||'';

    try {
        const responseAPi = await axios.get(URL_API_CORONA);
        if (typeof responseAPi === "undefined") { throw new Error("API sin data") }
        const streamData: any[] = responseAPi.data.feed.entry;

        for (const item of streamData) {
            const casoAPI: Actualizacion = {
              Lugar: item.gsx$country.$t || '',
              Contagiados: Number.parseInt(item.gsx$confirmedcases.$t.replace(',','')),
              Decesos: item.gsx$reporteddeaths.$t === '' ? 0 : Number.parseInt(item.gsx$reporteddeaths.$t.replace(',','')),
              Actualizado: item.updated.$t || ''
            };

            casoAPI.Lugar.trim();
            log(`Evaluamos ${casoAPI.Lugar}:`);
            await registraSiNuevosCasos(casoAPI);
        }

        log('proceso finalizado a las ', new Date().toLocaleString());
        log({nuevosLugaresMundo: nuevosCasos, actualizacionCasos: nuevosCasosModificados })
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

    if ( typeof casosLugarInDatabase === "undefined" || casosLugarInDatabase.length === 0 ){
        log(`...nuevo lugar encontrado: ${casoAPI.Lugar}`);
        nuevosCasos = [...nuevosCasos, casoAPI.Lugar ];
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

    ultimaFechaActualizacion = casosLugarInDatabase.reduce((acc, curr) => new Date(curr.Actualizado) > fechaActualizacionAPI ? curr.Actualizado : ultimaFechaActualizacion )

    const { Contagiados, Decesos } = casosLugarInDatabase.find(caso => caso.Actualizado === ultimaFechaActualizacion );
    
    if ( (casoAPI.Contagiados !== Contagiados) || (casoAPI.Decesos !== Decesos) ){
        const contagiados = casoAPI.Contagiados !== Contagiados ? (casoAPI.Contagiados - Contagiados) : 0;
        const decesos = casoAPI.Decesos !== Decesos ? (casoAPI.Decesos - Decesos) : 0;
        
        let glosa:string = '';
        if (contagiados !== 0){
            glosa = `+${contagiados} contagiados`;
        }
        if (decesos !== 0){
            glosa = glosa.length > 0 ?  glosa + ` y +${decesos} decesos` : ` +${decesos} decesos`;
        }
        
        log(`...actualizacion encontrada en: ${casoAPI.Lugar} (${glosa})`)
        nuevosCasosModificados = [...nuevosCasosModificados, {"Lugar": casoAPI.Lugar, "Actualizacion": glosa}];
        await ingresaActualizacionInDB(casoAPI);
    }
    
    return;
}


export const getCasesReport = async() => {
    try {
        const URI_MONGO: string = process.env.MONGODB_URI || '';
        await mongoose.connect(URI_MONGO, { useNewUrlParser: true, useUnifiedTopology: true } );
        const CasosReport = mongoose.model('CasosReport', casosReportSchema);
        const casosRepoty: any[] = await CasosReport.find();

        return casosRepoty;
    } catch (error) {
        log(error.messages);
        getCasesReport();
    }
}


export const geCurvaByCountryInDB = async(country: string) => {
    try {
        
        const URI_MONGO: string = process.env.MONGODB_URI ||'';
        await mongoose.connect(URI_MONGO, {useNewUrlParser: true, useUnifiedTopology: true} );
        const CurvaContag = mongoose.model('curvaContagios', curvaContagSchema);

        const first = country.substr(0,1);
        country = country.replace(first, first.toUpperCase());
        const result: any[] = await CurvaContag.find({"lugar": country});
        
        if (typeof result === "undefined") { throw new Error("Ninguna coincidencia de busqueda"); }
        
        return result;

    } catch (error) {
        geCurvaByCountryInDB(country);
        console.log('Error: {geCurvaByCountryInDB} - ', error.message);
    }
}





const truncateCaseReport = async() => {
    try {
        const CasosReport = mongoose.model('CasosReport', casosReportSchema);
        log('- inicia truncate de casos-report...')
        const { deletedCount } = await CasosReport.collection.deleteMany({});
        if (deletedCount && deletedCount > 0) {
            log('colletion truncada OK.')
            return  true; 
        }else {
            log('problemas al truncar colletion.')
            return false;
        }
    } catch (error) {
        log('error - {truncateCaseReport}')
        truncateCaseReport();
    }
}

const truncateCollCurvas = async() => {
    try {
        const CurvaContagios = mongoose.model('curvaContagios', curvaContagSchema);
        log('- inicia truncate de curvas...')
        const { deletedCount } = await CurvaContagios.collection.deleteMany({});
        if (deletedCount && deletedCount > 0) {
            log('colletion truncada OK.')
            return  true; 
        }else {
            log('problemas al truncar colletion.')
            return false;
        }
    } catch (error) {
        log('error - {truncateCollCurvas}')
        truncateCollCurvas();
    }
}

export const getListCases = async() => {
    try {
        const Casos = mongoose.model('Casos', casoVirusSchema);
        log('- inicia consulta de casos...')
        const casosAll: any[] = await Casos.find();
        let pses: string[] = [];
        casosAll.map(x => pses.push(x.Lugar));
        const paises = [...new Set(pses)];
        log('consulta de casos OK.')
        return { paises , casosAll };
    } catch (error) {
        log('error - {getListCases}')
        getListCases();
    }
}

function horasToTiempoGlosa (hrs: number) {
    const dias = Math.floor(hrs / 24);
    const horas = Math.floor(hrs % 24);
    if (dias === 0 && horas > 0) return `${horas.toFixed(0)}h`;
    if (dias > 0 && horas === 0) return `${dias.toFixed(0)}d`;
    if (dias > 0 && horas > 0) return `${dias.toFixed(0)}d ${horas.toFixed(0)}h`
}

const datosGlobales = async() => {

    const URL_API_CORONA = process.env.URL_API_CORONA||'';
    const responseAPi = await axios.get(URL_API_CORONA);
    if (typeof responseAPi === "undefined") { throw new Error("API sin data") }
    const streamData: any[] = responseAPi.data.feed.entry;
    
    const totalContagiados = streamData.reduce((acc, val) => acc + Number.parseInt(val.gsx$confirmedcases.$t.replace(',','')), 0);
    const totalDecesos = streamData.reduce((acc, val) => acc + (val.gsx$reporteddeaths.$t === '' ? 0 : Number.parseInt(val.gsx$reporteddeaths.$t.replace(',',''))), 0);
    return { totalContagiados, totalDecesos };
}

const calcCurvaContagiados = (casos: Actualizacion[]): CurvaContagiadosModel => {
    let curvaContagiados: number[] = [];
    let lugar = casos[0].Lugar;
    for ( const [idx, caso] of casos.entries() ) {
        if (idx === 0){
            curvaContagiados.push(caso.Contagiados);
        } else if (caso.Contagiados !== 0) {
            curvaContagiados.push(caso.Contagiados - casos[idx - 1].Contagiados);
        }
    } return {valores: curvaContagiados, lugar};
}


export const populateReport = async() => {
    
    const URI_MONGO: string = process.env.MONGODB_URI || '';
    await mongoose.connect(URI_MONGO, { useNewUrlParser: true, useUnifiedTopology: true } );
    const CasosReport = mongoose.model('CasosReport', casosReportSchema);
    const CurvaContagDB = mongoose.model('curvaContagios', curvaContagSchema);
    
    log('--- INICIO poblacion de report ---')
    const { ...vars } = await getListCases();

    await truncateCaseReport();
    await truncateCollCurvas();
    
    vars.paises.map(async(pais) => {

        let casosReport;
        const arrayLug: Actualizacion[] = vars.casosAll.filter(cas => cas.Lugar === pais);
        const { Contagiados: contagiados_1, Lugar, Decesos: Decesos_1, Actualizado } = arrayLug[arrayLug.length - 1];

        let {valores, lugar} = calcCurvaContagiados(arrayLug);
        const curvaContagDB = new CurvaContagDB({ lugar, valores });

        if ( arrayLug.length > 1 ) {

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
                const percent: PercentageModel =  {
                    Fecha: caso.Actualizado,
                    percent: ((caso.Decesos / caso.Contagiados) * 100).toFixed(1)
                }; percentages.push(percent);
            });

            casosReport = new CasosReport({
                lugar: Lugar,
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
                lugar: Lugar,
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
}



export const corrigeLugares2 = async () => {
    try {
        const Casos = mongoose.model('Casos', casoVirusSchema);
        log('- inicia consulta de casos...')
        const casosAll: any[] = await Casos.find();
        let pses: string[] = [];
        casosAll.map(x => pses.push(x.Lugar));
        const paises = [...new Set(pses)];
        log('consulta de casos OK.')
        return paises;
    } catch (error) {
        log('error - {getListCases}')
        getListCases();
    }
}