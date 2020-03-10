"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var controllers_1 = require("./controllers");
app.get('/cases/:country', controllers_1.obtenerCasoPorPais);
module.exports = app;
