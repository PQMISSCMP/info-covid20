require("dotenv").config();
import { populateCases } from "./repository";

setInterval(async() => {
    await populateCases();
}, 60 * 60000);

populateCases();