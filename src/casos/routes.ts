import express from "express";
const router = express();

import { obtenerCasoPorPais, listarCasos, corrigeLugares, obtenerCurvasPais} from "./controllers";

router.get('/cases', listarCasos);
router.get('/cases/:country', obtenerCasoPorPais);
// router.get('/corrige', corrigeLugares);
router.get('/report/:country', obtenerCurvasPais);

export = router;
