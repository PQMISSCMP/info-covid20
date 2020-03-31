import express from "express";
const router = express();

import { obtenerCasoPorPais, listarCasos, corrigeLugares} from "./controllers";

router.get('/cases', listarCasos);
router.get('/cases/:country', obtenerCasoPorPais);
router.get('/corrige', corrigeLugares);

export = router;
