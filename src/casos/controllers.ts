
import { Request, Response } from "express";
import {  getCasoByCountryInDB, getCasesReport, corrigeLugares2, geCurvaByCountryInDB } from "./repository";
const log = console.log;

export const obtenerCasoPorPais = async (req: Request, res: Response) => {
    try {
        const country  = req.params.country;
        const casos = await getCasoByCountryInDB(country);
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.status(200).json(casos);
    } catch (error) { 
        res.status(500).json(error.message)
        log(error); 
    }
}

export const obtenerCurvasPais = async (req: Request, res: Response) => {
    try {
        const country  = req.params.country;
        const casos = await geCurvaByCountryInDB(country);
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.status(200).json(casos);
    } catch (error) { 
        res.status(500).json(error.message)
        log(error); 
    }
}

export const listarCasos = async (req: Request, res: Response) => {
    try {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        const casosReporte = await getCasesReport();
        res.status(200).json(casosReporte);
    } catch (error) {
        res.status(500).send(error.messages)
    }
}

export const corrigeLugares = async (req: Request, res: Response) => {
    try {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        const casosReporte = await corrigeLugares2();
        res.status(200).json(casosReporte);
    } catch (error) {
        res.status(500).send(error.messages)
    }
}

