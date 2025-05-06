import { Router } from "express";
import { check } from "express-validator";
import { postEvento, getEventos, getEventoPorId, putEvento, deleteEvento } from "./evento.controller.js";
import { validarIdEvento } from "../helpers/db-validator-eventos.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
    "/postEvento",
    [
        validarCampos
    ],
    postEvento
)

router.get("/getEventos", getEventos);

router.get(
    "/getEventoPorId/:id",
    [
        check("id", "id invalid!").isMongoId(),
        check("id").custom(validarIdEvento),
        validarCampos
    ],
    getEventoPorId
)

router.put(
    "/putEvento/:id",
    [
        check("id", "id invalid!").isMongoId(),
        check("id").custom(validarIdEvento),
        validarCampos
    ],
    putEvento
)

router.delete(
    "/deleteEvento/:id",
    [
        check("id", "id invalid!").isMongoId(),
        check("id").custom(validarIdEvento),
        validarCampos
    ],
    deleteEvento
)

export default router;