import { response, request } from "express";
import Reservacion from "./reservacion.model.js";
import User from "../users/user.model.js";
import Hotel from "../hoteles/hotel.model.js";

export const postReservacion = async (req, res) => {
    try {
        const { nombreUsuario, nombreHotel, habitaciones, eventos, fechaOcupacion, fechaDesocupacion } = req.body;

        const usuario = await User.findOne({ name: nombreUsuario.toLowerCase() });
        const hotel = await Hotel.findOne({ name: nombreHotel.toLowerCase() });

        const reservacion = new Reservacion({
            nombreUsuario: usuario._id,
            nombreHotel: hotel._id,
            habitaciones,
            eventos,
            fechaOcupacion,
            fechaDesocupacion
        });

        await reservacion.save();

        const reservacionPopulada = await Reservacion.findById(reservacion._id)
            .populate('nombreUsuario', 'name')
            .populate('nombreHotel', 'name')
            .populate('habitaciones', 'type price')
            .populate('eventos', 'tipoSala numeroSalas precio');

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
                .populate('nombreUsuario', 'name')
                .populate('nombreHotel', 'name')
                .populate('habitaciones', 'type price')
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
        const { habitaciones, eventos } = req.body;

        const reservacion = await Reservacion.findById(id);
        
        if (!reservacion) {
            return res.status(404).json({
                success: false,
                message: 'Reservación no encontrada!'
            });
        }

        if (habitaciones) {
            reservacion.habitaciones = habitaciones;
        }
        if (eventos) {
            reservacion.eventos = eventos;
        }

        await reservacion.save();

        const reservacionPopulada = await Reservacion.findById(reservacion._id)
            .populate('nombreUsuario', 'name')
            .populate('nombreHotel', 'name')
            .populate('habitaciones', 'type price')
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