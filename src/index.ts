import rutas = require("./casos/routes");
import express from "express";
const app = express();

require("dotenv").config();
app.use(rutas);

const port = (process.env.PORT || 3000);
app.listen(port, () => {
    console.log(`escuchando en puerto ... ${port}`);
});
