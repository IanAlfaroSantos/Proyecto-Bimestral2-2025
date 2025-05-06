import { response, request } from "express";
import Reservacion from "./reservacion.model.js";
//import Habitacion from "../rooms/room.model.js";
import Evento from "../eventos/evento.model.js";
import { validarNombreUsuario, validarNombreHotel, /*validarHabitacion,*/ validarIdEvento } from '../helpers/db-validator-reservaciones.js';

export const postReservacion = async (req = request, res = response) => {
    try {
        const { nombreUsuario, nombreHotel, habitaciones = [], eventos = [], fechaOcupacion } = req.body;

        if (!habitaciones.length && !eventos.length) {
            return res.status(400).json({
                success: false,
                message: 'Debe ingresar al menos una habitación o evento!'
            });
        }

        const usuario = await validarNombreUsuario(nombreUsuario);
        const hotel = await validarNombreHotel(nombreHotel);

        for (const habitacionId of habitaciones) {
            await validarHabitacion(habitacionId, hotel._id);
        }

        for (const eventoId of eventos) {
            await validarIdEvento(eventoId, hotel._id);
        }

        const reservacion = new Reservacion({
            usuario: usuario._id,
            hotel: hotel._id,
            habitaciones,
            eventos,
            fechaOcupacion
        });

        await reservacion.save();

        await Promise.all(habitaciones.map(async (id) => {
            await Habitacion.findByIdAndUpdate(id, { status: false });
        }));

        await Promise.all(eventos.map(async (eventoId) => {
            await Evento.findByIdAndUpdate(eventoId, { status: false });
        }));

        res.status(200).json({
            success: true,
            message: 'Reservación creada exitosamente!',
            reservacion
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear reservación!',
            error: error.message
        });
    }
};

export const getReservaciones = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, reservaciones] = await Promise.all([
            Reservacion.countDocuments(query),
            Reservacion.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            reservaciones
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error cargando reservaciones!',
            error
        });
    }
};

export const getReservacionPorId = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const reservacion = await Reservacion.findById(id);

        if (!reservacion) {
            return res.status(404).json({
                success: false,
                msg: 'Reservación no encontrada!'
            });
        }

        res.status(200).json({
            success: true,
            reservacion
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error cargando reservación!',
            error
        });
    }
};

export const putReservacion = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { habitaciones = [], eventos = [], fechaDesocupacion } = req.body;

        const reservacion = await Reservacion.findById(id);
        if (!reservacion) {
            return res.status(404).json({
                success: false,
                message: 'Reservación no encontrada!'
            });
        }

        for (const habitacionId of habitaciones) {
            await validarHabitacion(habitacionId, reservacion.hotel);
        }

        for (const eventoId of eventos) {
            await validarIdEvento(eventoId);
        }

        reservacion.habitaciones = habitaciones;
        reservacion.eventos = eventos;
        reservacion.fechaDesocupacion = fechaDesocupacion;

        await reservacion.save();

        await Promise.all(habitaciones.map(async (id) => {
            await Habitacion.findByIdAndUpdate(id, { status: false });
        }));

        await Promise.all(eventos.map(async (eventoId) => {
            await Evento.findByIdAndUpdate(eventoId, { status: false });
        }));

        res.status(200).json({
            success: true,
            message: 'Reservación actualizada exitosamente!',
            reservacion
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error actualizando reservación!',
            error: error.message
        });
    }
};

export const deleteReservacion = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const reservacion = await Reservacion.findByIdAndUpdate(id, { status: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Reservación eliminada!',
            reservacion,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error eliminando reservación!',
            error
        });
    }
};