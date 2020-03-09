import { populateCases } from "./controllers";

setInterval(async() => {
    await populateCases();
}, 60 * 60000);
