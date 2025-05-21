import { Router } from "express";

import { getInformeDemandaHoteles, getInformeReservacionesPorHotel } from "./informe.controller.js";




const router = Router()


router.get('/demanda', getInformeDemandaHoteles);

router.get('/reservaciones/:hotelId', getInformeReservacionesPorHotel)


export default router;

