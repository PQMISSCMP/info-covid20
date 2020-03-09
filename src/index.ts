import rutas = require("./casos/routes");
import express from "express";

const app = express();

app.use(rutas);

app.listen(3000, () => {
    console.log("escuchando ...");
});