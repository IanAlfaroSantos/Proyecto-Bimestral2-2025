import { Router } from "express";
import { check } from "express-validator";
import { postReservacion, getReservaciones, getReservacionPorId, putReservacion, deleteReservacion } from "./reservacion.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/postReservacion",
    validarJWT,
    validarCampos,
    postReservacion
);

router.get("/getReservaciones", getReservaciones);

router.get(
    "/getReservacionPorId/:id",
    [
        check("id", "id invalid!").isMongoId(),
        validarCampos
    ],
    getReservacionPorId
)

router.put(
    "/putReservacion/:id",
    [
        check("id", "id invalid!").isMongoId(),
        validarCampos
    ],
    putReservacion
)

router.delete(
    "/deleteReservacion/:id",
    [
        check("id", "id invalid!").isMongoId(),
        validarCampos
    ],
    deleteReservacion
)

export default router;