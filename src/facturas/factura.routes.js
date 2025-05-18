import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import {  postFactura,getFacturas} from "./factura.controller.js";

const router = Router();

router.post( 
    "/",[
        validarJWT
    ],
    postFactura
);


router.get("/",validarJWT,getFacturas);


export default router;