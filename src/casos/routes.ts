import express from "express";
const router = express();

import { obtenerCasoPorPais, listarReport, obtenerCurvasPais} from "./controllers";

router.get('/cases', listarReport);
router.get('/cases/:country', obtenerCasoPorPais);
router.get('/resumes/:country', obtenerCurvasPais);

export = router;
