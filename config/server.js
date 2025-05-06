'use strict';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mogo.js';
import limiter from '../src/middlewares/validate-cant-peticiones.js';
import userRoutes from "../src/users/user.routes.js";
import hotelRoutes from "../src/hoteles/hotel.routes.js";
import eventoRoutes from "../src/eventos/evento.routes.js";
import reservacionRoutes from "../src/reservaciones/reservacion.routes.js";
import roomRoutes from "../src/rooms/room.routes.js"
import { createAdminWeb, createAdminHotel } from '../src/users/user.controller.js';

const configurarMiddlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const configurarRutas = (app) => {
    app.use('/hoteles/users', userRoutes);
    app.use('/hoteles/hoteles', hotelRoutes);
    app.use('/hoteles/eventos', eventoRoutes);
    app.use('/hoteles/reservaciones', reservacionRoutes);
    app.use('/hoteles/rooms', roomRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexion realizada a la base de datos");
        await createAdminWeb();
        await createAdminHotel();
    } catch (error) {
        console.error('Ocurrio un error al intentar conectar con la base de datos', error);
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;
    await conectarDB();
    configurarMiddlewares(app);
    configurarRutas(app);
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);

    });

}