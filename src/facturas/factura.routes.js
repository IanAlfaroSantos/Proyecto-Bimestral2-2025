import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import {  postFactura,getFacturas, getFacturasByUser} from "./factura.controller.js";

const router = Router();

router.post( 
    "/",[
        validarJWT
    ],
    postFactura
);


router.get("/",validarJWT,getFacturas);

router.get("/own", validarJWT, getFacturasByUser)

export default router;