"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rutas = require("./casos/routes");
var express_1 = __importDefault(require("express"));
var app = express_1.default();
app.use(rutas);
var port = (process.env.PORT || 3000);
app.listen(port, function () {
    console.log("escuchando en puerto ... " + port);
});
