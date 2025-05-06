import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { deleteHotel, getHotelById, getHoteles, saveHotel, updateHotel } from "./hotel.controller.js";

const router = Router();

router.post(
    "/",
    validarJWT,
    validarCampos,
    saveHotel
)

router.get(
    "/",
    getHoteles
)

router.get(
    "/:id",
    [
        check("id", "Invalid ID").not().isEmpty(),
        validarCampos
    ],
    getHotelById
)

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "Invalid ID").not().isEmpty(),
        check("categoria", "Invalid category. Valid category are: '1 estrella' or '2 estrellas' or '3 estrellas' or '4 estrellas' or '5 estrellas'")
            .isIn(["1 estrella", "2 estrellas", "3 estrellas", "4 estrellas", "5 estrellas"]),
        validarCampos
    ],
    updateHotel
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "Invalid ID").not().isEmpty(),
        validarCampos
    ],
    deleteHotel
)

export default router;