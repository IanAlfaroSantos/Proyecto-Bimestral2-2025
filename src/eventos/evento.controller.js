import { response, request } from "express";
import Evento from "./evento.model.js";
import Hotel from "../hoteles/hotel.model.js";

export const postEvento = async (req, res) => {
    try {
        const { nombreHotel, tipoSala, numeroSalas, precio } = req.body;

        const hotel = await Hotel.findOne({ nombre: nombreHotel });
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: `Hotel con nombre "${nombreHotel}" no encontrado!`
            });
        }

        const eventoExistente = await Evento.findOne({ hotel: hotel._id });
        if (eventoExistente) {
            return res.status(400).json({
                success: false,
                message: 'Este hotel ya tiene salas asignadas! - Solo puedes modificar mediante actualización!'
            });
        }

        const evento = new Evento({
            hotel: hotel._id,
            tipoSala,
            numeroSalas,
            precio
        });

        await evento.save();

        res.status(200).json({
            success: true,
            message: 'Evento guardado!',
            evento
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error guardando evento!',
            error: error.message
        });
    }
};

export const getEventos = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, eventos] = await Promise.all([
            Evento.countDocuments(query),
            Evento.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            eventos
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error cargando eventos!',
            error
        })
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
        const { numeroSalas } = req.body;

        const evento = await Evento.findById(id);
        if (!evento) {
            return res.status(404).json({
                success: false,
                message: 'Evento no encontrado!'
            });
        }

        const hotel = await Hotel.findById(evento.hotel);
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel no encontrado!'
            });
        }

        const diferenciaSalas = numeroSalas - evento.numeroSalas;
        if (hotel.salasDisponibles + diferenciaSalas < 0) {
            return res.status(400).json({
                success: false,
                message: 'No hay suficientes salas disponibles en el hotel para este evento!'
            });
        }

        evento.numeroSalas = numeroSalas;
        await evento.save();

        hotel.salasDisponibles += diferenciaSalas;
        await hotel.save();

        res.status(200).json({
            success: true,
            message: 'Evento actualizado y salas del hotel ajustadas!',
            evento
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error actualizando evento!',
            error: error.message
        });
    }
};

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