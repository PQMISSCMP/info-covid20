"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var axios_1 = __importDefault(require("axios"));
var log = console.log;
var casoVirusSchema = new mongoose_1.default.Schema({
    Lugar: String,
    Contagiados: Number,
    Decesos: Number,
    Actualizado: String,
});
/**
 * @param new_caso
 * Ingresa una nueva actualización en MongoDB
 */
exports.ingresaActualizacionInDB = function (new_caso) { return __awaiter(void 0, void 0, void 0, function () {
    var URI_MONGO, Caso, caso, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                URI_MONGO = process.env.MONGODB_URI || '';
                return [4 /*yield*/, mongoose_1.default.connect(URI_MONGO, { useNewUrlParser: true, useUnifiedTopology: true })];
            case 1:
                _a.sent();
                Caso = mongoose_1.default.model('Casos', casoVirusSchema);
                caso = new Caso({
                    Lugar: new_caso.Lugar,
                    Contagiados: new_caso.Contagiados,
                    Decesos: new_caso.Decesos,
                    Actualizado: new_caso.Actualizado
                });
                return [4 /*yield*/, caso.save()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log("Error: {ingresaActualizacionInDB} - ", error_1.message);
                exports.ingresaActualizacionInDB(new_caso);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * @param country
 * Busca en MongoDB las actualizaciones ya ingresadas por un pais o lugar dado
 */
exports.getCasoByCountryInDB = function (country) { return __awaiter(void 0, void 0, void 0, function () {
    var URI_MONGO, Caso, first, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                URI_MONGO = process.env.MONGODB_URI || '';
                return [4 /*yield*/, mongoose_1.default.connect(URI_MONGO, { useNewUrlParser: true, useUnifiedTopology: true })];
            case 1:
                _a.sent();
                Caso = mongoose_1.default.model('Casos', casoVirusSchema);
                first = country.substr(0, 1);
                country = country.replace(first, first.toUpperCase());
                return [4 /*yield*/, Caso.find({ "Lugar": country })];
            case 2:
                result = _a.sent();
                if (typeof result === "undefined") {
                    throw new Error("Ninguna coincidencia de busqueda");
                }
                return [2 /*return*/, result];
            case 3:
                error_2 = _a.sent();
                exports.getCasoByCountryInDB(country);
                console.log('Error: {getCasoByCountryInDB} - ', error_2.message);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var nuevosCasos = [];
var nuevosCasosModificados = [];
/**
 *  Consulta una API externa (fuente descnocida) con datos actualizados del COVID y contrasta con los datos en MongoDB para saber si hay nuevos decesos o contagiados
 */
exports.populateCases = function () { return __awaiter(void 0, void 0, void 0, function () {
    var URL_API_CORONA, responseAPi, streamData, _i, streamData_1, item, casoAPI, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.time();
                log('Se inicia proceso de población de datos at ', new Date().toLocaleString());
                URL_API_CORONA = process.env.URL_API_CORONA || '';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, axios_1.default.get(URL_API_CORONA)];
            case 2:
                responseAPi = _a.sent();
                if (typeof responseAPi === "undefined") {
                    throw new Error("API sin data");
                }
                streamData = responseAPi.data.feed.entry;
                _i = 0, streamData_1 = streamData;
                _a.label = 3;
            case 3:
                if (!(_i < streamData_1.length)) return [3 /*break*/, 6];
                item = streamData_1[_i];
                casoAPI = {
                    Lugar: item.gsx$country.$t || '',
                    Contagiados: Number.parseInt(item.gsx$confirmedcases.$t.replace(',', '')),
                    Decesos: item.gsx$reporteddeaths.$t === '' ? 0 : Number.parseInt(item.gsx$reporteddeaths.$t.replace(',', '')),
                    Actualizado: item.updated.$t || ''
                };
                log("Evaluamos " + casoAPI.Lugar + ":");
                return [4 /*yield*/, registraSiNuevosCasos(casoAPI)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6:
                log('proceso finalizado a las ', new Date().toLocaleString());
                log({ nuevosLugaresMundo: nuevosCasos, actualizacionCasos: nuevosCasosModificados });
                console.timeEnd();
                return [2 /*return*/];
            case 7:
                error_3 = _a.sent();
                console.log(error_3.message);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
/**
 *
 * @param casoAPI
 * Contrasta datos de Covid con la ultima actualizacion ingresada en Mongo y pobla datos
 */
var registraSiNuevosCasos = function (casoAPI) { return __awaiter(void 0, void 0, void 0, function () {
    var casosLugarInDatabase, ultimaFechaActualizacion, fechaActualizacionAPI, _a, Contagiados, Decesos, contagiados, decesos, glosa;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, exports.getCasoByCountryInDB(casoAPI.Lugar)];
            case 1:
                casosLugarInDatabase = _b.sent();
                if (!(typeof casosLugarInDatabase === "undefined" || casosLugarInDatabase.length === 0)) return [3 /*break*/, 3];
                log("...nuevo lugar encontrado: " + casoAPI.Lugar);
                nuevosCasos = __spreadArrays(nuevosCasos, [casoAPI.Lugar]);
                return [4 /*yield*/, exports.ingresaActualizacionInDB(casoAPI)];
            case 2:
                _b.sent();
                return [2 /*return*/];
            case 3:
                ultimaFechaActualizacion = casosLugarInDatabase[0].Actualizado;
                fechaActualizacionAPI = new Date(casosLugarInDatabase[0].Actualizado);
                casosLugarInDatabase.forEach(function (casoDB) {
                    if (new Date(casoDB.Actualizado) > fechaActualizacionAPI) {
                        ultimaFechaActualizacion = casoDB.Actualizado;
                    }
                });
                _a = casosLugarInDatabase.find(function (caso) { return caso.Actualizado === ultimaFechaActualizacion; }), Contagiados = _a.Contagiados, Decesos = _a.Decesos;
                if (!((casoAPI.Contagiados !== Contagiados) || (casoAPI.Decesos !== Decesos))) return [3 /*break*/, 5];
                contagiados = casoAPI.Contagiados !== Contagiados ? (casoAPI.Contagiados - Contagiados) : 0;
                decesos = casoAPI.Decesos !== Decesos ? (casoAPI.Decesos - Decesos) : 0;
                glosa = '';
                if (contagiados !== 0) {
                    glosa = "+" + contagiados + " contagiados";
                }
                if (decesos !== 0) {
                    glosa = glosa.length > 0 ? glosa + (" y +" + decesos + " decesos") : " +" + decesos + " decesos";
                }
                log("...actualizacion encontrada en: " + casoAPI.Lugar + " (" + glosa + ")");
                nuevosCasosModificados = __spreadArrays(nuevosCasosModificados, [{ "Lugar": casoAPI.Lugar, "Actualizacion": glosa }]);
                return [4 /*yield*/, exports.ingresaActualizacionInDB(casoAPI)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
