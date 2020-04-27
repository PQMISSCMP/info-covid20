import mongoose from 'mongoose';

export interface Actualizacion {
    Lugar: string;
    Contagiados: number;
    Decesos: number;
    Actualizado: Date;
}

export interface CasosReport {
    Lugar: string;
    TotalContagiados: number;
    TotalDecesos: number;
    UltContagiados: number;
    UltDecesos: number;
    tiempoDesdeUltAct: String,
    tiempoHastaAhora: String
    FechUltActualizacion: Date;
}

export const casoVirusSchema = new mongoose.Schema({
    Lugar: String,
    Contagiados: Number,
    Decesos: Number,
    Actualizado: String,
});

export const actualizacionesSchema = new mongoose.Schema({
    Lugar: String,
    Contagiados: Number,
    Decesos: Number,
    Actualizado: String,
});


export const casosReportSchema = new mongoose.Schema({
    lugar: String,
    totalContagiados: Number,
    totalDecesos: Number,
    porcent: Number,
    ultContagiados: Number,
    statusContagiados: String,
    nroContagiadosAnt: Number,
    ultDecesos: Number,
    statusDecesos: String,
    nroDecesosAnt: Number,
    tiempoDesdeUltAct: String,
    fechUltActualizacion: Date
});

export const curvasSchema = new mongoose.Schema({
    lugar: String,
    curvaContagios: Array,
    curvaDecesos: Array,
    curvaPorcentajes: Array
});



export interface ResponseListCases {
    paises: string[], 
    casosAll: any[]
}


export interface PercentageModel{ 
    percent: string; 
    Fecha: Date; 
}


export interface CurvaPaisModel {
    valor: number;
    fecha: string;
}