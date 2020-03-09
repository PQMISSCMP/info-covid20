import express from "express";
const app = express();

import { populateCases, obtenerCasoPorPais } from "./controllers";


app.get('/cases/:country', obtenerCasoPorPais);

export = app;
