
import mongoose from 'mongoose';
import axios from "axios";
import nodemailer from 'nodemailer';

const log = console.log;
export interface Actualizacion {
    Lugar: string;
    Contagiados: number;
    Decesos: number;
    Actualizado: Date;
}

const casoVirusSchema = new mongoose.Schema({
    Lugar: String,
    Contagiados: Number,
    Decesos: Number,
    Actualizado: String,
});

/**
 * @param new_caso 
 * Ingresa una nueva actualización en MongoDB
 */
export const ingresaActualizacionInDB = async(new_caso: Actualizacion) => {
    try {
        const URI_MONGO: string = process.env.MONGODB_URI ||'';
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

            log(`Evaluamos ${casoAPI.Lugar}:`);
            await registraSiNuevosCasos(casoAPI);
        }

        log('proceso finalizado a las ', new Date().toLocaleString());
        log({nuevosLugaresMundo: nuevosCasos, actualizacionCasos: nuevosCasosModificados })
        if (nuevosCasos.length > 0 || nuevosCasosModificados.length > 0) enviarNotificacion({nuevosLugaresMundo: nuevosCasos, actualizacionCasos: nuevosCasosModificados });
        console.timeEnd();
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

    casosLugarInDatabase.forEach(casoDB => {    
        if (new Date(casoDB.Actualizado) > fechaActualizacionAPI ){
            ultimaFechaActualizacion = casoDB.Actualizado;
        }
    });

    // casosLugarInDatabase.reduce((acc, val) => new Date(val.Actualizado) > fechaActualizacionAPI ? val.Actualizado )

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


const enviarNotificacion = async(result: any) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.MAIL,
                pass: process.env.PWD
            }
        });
    
        const mailOptions = {
            from: 'Remitente',
            to: process.env.MAIL,
            subject: 'Resultado actualización COVID-19',
            text: JSON.stringify(result)
        };
    
        await transporter.sendMail(mailOptions);
        
    } catch (error) {
        log(error);
    }

}


export const getCases = async() => {

    try {
        const URL_API_CORONA = process.env.URL_API_CORONA||'';

        const responseAPi = await axios.get(URL_API_CORONA);
        
        if (typeof responseAPi === "undefined") { throw new Error("API sin data") }

        const entrys: any[] = responseAPi.data.feed.entry;
        const listaActualizaciones: Actualizacion[] = [];
        for (const entry of entrys) {
            const actualizacion: Actualizacion = {
              Lugar: entry.gsx$country.$t || '',
              Contagiados: Number.parseInt(entry.gsx$confirmedcases.$t.replace(',','')),
              Decesos: entry.gsx$reporteddeaths.$t === '' ? 0 : Number.parseInt(entry.gsx$reporteddeaths.$t.replace(',','')),
              Actualizado: entry.updated.$t || ''
            };
            listaActualizaciones.push(actualizacion);
        }
        return listaActualizaciones;
    } catch (error) {
        log(error.messages);
        getCases();
    }
}