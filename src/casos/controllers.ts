
import { Request, Response } from "express";
import {  getCasoByCountryInDB } from "./repository";
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

