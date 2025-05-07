import { response, request } from "express";
import Reservacion from "./reservacion.model.js";
import Room from "../rooms/room.model.js";
import Evento from "../eventos/evento.model.js";
import {
    validarHabitaciones,
    validarEventos,
    validarUsuarioYHotel
} from "../helpers/db-validator-reservaciones.js";

export const postReservacion = async (req, res) => {
    try {
        const {
            nombreUsuario,
            nombreHotel,
            habitaciones = [],
            eventos = [],
            fechaOcupacion,
            fechaDesocupacion
        } = req.body;

        if (habitaciones.length === 0 && eventos.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe ingresar al menos una habitación o un evento!'
            });
        }

        const { usuario, hotel, error } = await validarUsuarioYHotel(nombreUsuario, nombreHotel);
        if (error) {
            return res.status(404).json({ success: false, message: error });
        }

        const errorHabitaciones = await validarHabitaciones(habitaciones, hotel._id);
        if (errorHabitaciones) {
            return res.status(400).json({ success: false, message: errorHabitaciones });
        }

        const errorEventos = await validarEventos(eventos, hotel._id);
        if (errorEventos) {
            return res.status(400).json({ success: false, message: errorEventos });
        }

        const reservacion = new Reservacion({
            nombreUsuario: usuario._id,
            nombreHotel: hotel._id,
            habitaciones,
            eventos,
            fechaOcupacion,
            fechaDesocupacion
        });

        await reservacion.save();

        await Room.updateMany({ _id: { $in: habitaciones } }, { status: false });
        await Evento.updateMany({ _id: { $in: eventos } }, { status: false });

        const reservacionPopulada = await Reservacion.findById(reservacion._id)
            .populate('nombreUsuario', 'name surname username email phone role status')
            .populate('nombreHotel', 'name direccion categoria comodidades status')
            .populate('habitaciones', 'type price status')
            .populate('eventos', 'tipoSala numeroSalas precio status');

        res.status(200).json({
            success: true,
            message: 'Reservación guardada satisfactoriamente!',
            reservacion: reservacionPopulada
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error guardando reservación!',
            error: error.message || error
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
                .populate('nombreUsuario', 'name surname username email phone role status')
                .populate('nombreHotel', 'name direccion categoria comodidades status')
                .populate('habitaciones', 'type price status')
                .populate('eventos', 'tipoSala numeroSalas precio')
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
            error: error.message || error
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

export const putReservacion = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { habitaciones, eventos, fechaDesocupacion } = req.body;

        const reservacion = await Reservacion.findById(id);

        if (!reservacion) {
            return res.status(404).json({
                success: false,
                message: 'Reservación no encontrada!'
            });
        }

        if (habitaciones) {
            const errorHabitaciones = await validarHabitaciones(habitaciones, reservacion.nombreHotel);
            if (errorHabitaciones) {
                return res.status(400).json({ success: false, message: errorHabitaciones });
            }

            reservacion.habitaciones = habitaciones;
        }

        if (eventos) {
            const errorEventos = await validarEventos(eventos, reservacion.nombreHotel);
            if (errorEventos) {
                return res.status(400).json({ success: false, message: errorEventos });
            }

            reservacion.eventos = eventos;
        }

        if (fechaDesocupacion) {
            reservacion.fechaDesocupacion = fechaDesocupacion;
            await Room.updateMany(
                { _id: { $in: reservacion.habitaciones } },
                { status: true }
            );
        }

        await reservacion.save();

        const reservacionPopulada = await Reservacion.findById(reservacion._id)
            .populate('nombreUsuario', 'name surname username email phone role status')
            .populate('nombreHotel', 'name direccion categoria comodidades status')
            .populate('habitaciones', 'type price status')
            .populate('eventos', 'tipoSala numeroSalas precio');

        res.status(200).json({
            success: true,
            message: 'Reservación actualizada satisfactoriamente!',
            reservacion: reservacionPopulada
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la reservación!',
            error: error.message || error
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