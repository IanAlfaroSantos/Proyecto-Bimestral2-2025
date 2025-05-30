import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import {getByType, getByHotelName, getRooms, createRoom, updateRoom } from "./room.controller.js";

const router = Router();

router.get( 
    "/",
    getRooms
);

router.get("/name/:name", getByHotelName);
router.get("/tipo/:type", getByType);

router.post(
    "/",
    [
        validarJWT,
        check("type", "El tipo de habitación debe ser uno de los siguientes: alta, media, baja").isIn(["alta", "media", "baja"]),
        check("quantity", "La cantidad de habitaciones debe ser un número mayor que 0").isInt({ gt: 0 }),
        check("price", "El precio de la habitación no puede ser 0").isFloat({ gt: 0 }),
        validarCampos
    ],
    createRoom
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "ID de habitación inválido").isMongoId(),
        validarCampos
    ],
    updateRoom
);

export default router;