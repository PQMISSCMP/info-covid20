import express from "express";
const router = express();

import { obtenerCasoPorPais, listarCasos, obtenerCurvasPais} from "./controllers";

router.get('/cases', listarCasos);
router.get('/cases/:country', obtenerCasoPorPais);
router.get('/report/:country', obtenerCurvasPais);

export = router;
