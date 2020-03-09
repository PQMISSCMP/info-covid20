import axios from "axios";
import { Request, Response } from "express";
import { ingresaActualizacionInDB, Actualizacion, getCasoByCountryInDB } from "./repository";
const log = console.log;


export const obtenerCasoPorPais = async (req: Request, res: Response) => {
    try {
        const country  = req.params.country;
        const casos = await getCasoByCountryInDB(country);
        res.status(200).json(casos);
    } catch (error) { 
        res.status(500).json(error.message)
        log(error); 
    }
}

let nuevosCasos: Actualizacion[] = [];
let nuevosCasosModificados: Actualizacion[] = [];

export const populateCases = async () => {
    console.time();
    log('Se inicia proceso de población de datos', new Date() );
    const URL_API_CORONA = 'https://spreadsheets.google.com/feeds/list/1lwnfa-GlNRykWBL5y7tWpLxDoCfs8BvzWxFjeOZ1YJk/1/public/values?alt=json';
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

        log('proceso finalizado a las ', new Date());
        log({nuevosLugaresMundo: nuevosCasos, actualizacionCasos: nuevosCasosModificados })
        console.timeEnd();
        return;

    } catch (error) { console.log(error.message); }

}

const registraSiNuevosCasos = async (casoAPI: Actualizacion) => {

    const casosLugarInDatabase = await getCasoByCountryInDB(casoAPI.Lugar);

    if ( typeof casosLugarInDatabase === "undefined" || casosLugarInDatabase.length === 0 ){
        log(`...nuevo lugar encontrado: ${casoAPI.Lugar}`);
        nuevosCasos = [...nuevosCasos, casoAPI];
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
        nuevosCasosModificados = [...nuevosCasosModificados, casoAPI];
        await ingresaActualizacionInDB(casoAPI);
    }
    
    return;
}