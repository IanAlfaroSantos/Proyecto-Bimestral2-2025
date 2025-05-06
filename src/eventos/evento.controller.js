import { response, request } from "express";
import Evento from "./evento.model.js";
import Hotel from '../hoteles/hotel.model.js';

export const postEvento = async (req, res) => {
    try {
        const data = req.body;

        const hotel = await Hotel.findOne({ name: data.hotel.toLowerCase() });

        data.hotel = hotel._id;

        const evento = new Evento(data);
        await evento.save();

        res.status(200).json({
            success: true,
            message: 'Evento guardado satisfactoriamente!',
            evento
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error guardando evento!',
            error
        });
    }
}

export const getEventos = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, eventos] = await Promise.all([
            Evento.countDocuments(query),
            Evento.find(query)
                .populate('hotel', 'name')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            eventos
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error cargando eventos!',
            error
        });
    }
}

export const getEventoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const evento = await Evento.findById(id);

        if (!evento) {
            return res.status(404).json({
                success: false,
                msg: 'Evento no encontrado!'
            })
        }

        res.status(200).json({
            success: true,
            evento
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error cargando evento!',
            error
        })
    }
}

export const putEvento = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { tipoSala, numeroSalas, precio } = req.body;

        const data = { tipoSala, numeroSalas, precio };

        const evento = await Evento.findByIdAndUpdate(id, data, {
            new: true
        }).populate('hotel', 'name');

        res.status(200).json({
            success: true,
            msg: 'Evento actualizado!',
            evento
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar!',
            error
        });
    }
}

export const deleteEvento = async (req, res) => {
    try {

        const { id } = req.params;

        const evento = await Evento.findByIdAndUpdate(id, { status: false }, { new: true });


        res.status(200).json({
            success: true,
            msg: 'Evento eliminado!',
            evento,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error eliminando!',
            error
        })
    }
}