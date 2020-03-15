import express from "express";
const router = express();

import { obtenerCasoPorPais, listarCasos} from "./controllers";

router.get('/cases', listarCasos);
router.get('/cases/:country', obtenerCasoPorPais);

export = router;
