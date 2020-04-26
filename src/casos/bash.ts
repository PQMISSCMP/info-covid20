require("dotenv").config();
import { populateCases, populateReport, getCorrigeLugares } from "./repository";

setInterval(async() => {
    await populateCases();
    await populateReport();
}, 60 * 60000);

(async _ => {
    await populateCases();
    await populateReport();
})();
