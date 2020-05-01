require("dotenv").config();
import { populateCases, populateReport } from "./repository";

setInterval(async() => {
    await populateCases();
    await populateReport();
}, 60 * 60000);

(async _ => {
    await populateCases();
    await populateReport();
})();
