import { response, request } from "express";
import Reservacion from "./reservacion.model.js";
import Room from "../rooms/room.model.js";
import Evento from "../eventos/evento.model.js";
import Usuario from "../users/user.model.js";
import hotelModel from "../hoteles/hotel.model.js";
import {
    validarHabitaciones,
    validarEventos,
    validarUsuarioYHotel
} from "../helpers/db-validator-reservaciones.js";

export const postReservacion = async (req, res) => {
    try {
        const {
            nombreHotel,
            habitaciones = [],
            eventos = [],
            fechaOcupacion,
            fechaDesocupacion
        } = req.body;

        
        const userId = req.user;

        if (habitaciones.length === 0 && eventos.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe ingresar al menos una habitación o un evento!'
            });
        }

        
        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado!'
            });
        }

       
        const hotel = await hotelModel.findOne({ name: nombreHotel });
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel no encontrado!'
            });
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
            nombreUsuario: userId, 
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

export const getReservacionesPorUsuario = async (req = request, res = response) => {
    try {
        const uid = req.user; 

        const reservaciones = await Reservacion.find({ nombreUsuario: uid, status: true })
            .populate('nombreUsuario', 'name surname username email phone role status')
            .populate('nombreHotel', 'name direccion categoria comodidades status')
            .populate('habitaciones', 'type price status')
            .populate('eventos', 'tipoSala numeroSalas precio');

        if (!reservaciones || reservaciones.length === 0) {
            return res.status(404).json({
                success: false,
                msg: 'No se encontraron reservaciones para este usuario.'
            });
        }

        res.status(200).json({
            success: true,
            total: reservaciones.length,
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

export const getReservacionPorHotel = async (req = request, res = response) => {
    try {
        const { nombreHotel } = req.params;

        const hoteles = await hotelModel.find({
            name: { $regex: nombreHotel, $options: 'i' },
            status: true
        });

        const hotelIds = hoteles.map(h => h._id);

        const reservaciones = await Reservacion.find({
            nombreHotel: { $in: hotelIds },
            status: true
        })
            .populate('nombreUsuario', 'name surname email phone')
            .populate('nombreHotel', 'name direccion categoria comodidades status')
            .populate('habitaciones', 'type price status')
            .populate('eventos', 'tipoSala numeroSalas precio');

        res.status(200).json({
            success: true,
            reservaciones
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al buscar reservaciones por nombre del hotel!',
            error: error.message || error
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