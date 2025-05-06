import { request, response } from "express";
import Hotel from "./hotel.model.js";
import { existeHotelById, soloAdminHotel, statusHotel, verificarHotelExistente } from "../helpers/db-validator-hoteles.js";

export const saveHotel = async (req, res) => {
    try {
        
        const data = req.body || {};
        
        await soloAdminHotel(req);

        const hotel = await Hotel.create({
            name: data.name,
            direccion: data.direccion,
            categoria: data.categoria,
            comodidades: data.comodidades
        })

        res.status(200).json({
            success: true,
            msg: "Hotel resgitrado con exito!!",
            hotel
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al registrar hotel",
            error: error.message
        })
    }
}

export const getHoteles = async (req = request, res = response) => {
    try {

        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [ total, hoteles ] = await  Promise.all([
            Hotel.countDocuments(query),
            Hotel.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            msg: "Hoteles obtenidos exitosamente!!",
            hoteles
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener los hoteles",
            error: error.message
        })
    }
}

export const getHotelById = async (req, res) => {
    try {
        
        const { id } = req.params;

        await existeHotelById(id);

        const hotel = await Hotel.findById(id);

        await statusHotel(hotel);

        res.status(200).json({
            success: true,
            msg: "Hotel encontrado exitosamente!!",
            hotel
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al buscar hotel",
            error: error.message
        })
    }
}

export const updateHotel = async (req, res = response) => {
    try {
        
        const { id } = req.params;
        const { _id, habitacionesDisponibles, salasDisponibles, ...data } = req.body || {};
        let { name } = req.body || {};

        await existeHotelById(id);

        const hotel = await Hotel.findById(id);
        await soloAdminHotel(req);
        await verificarHotelExistente(name, hotel);
        await statusHotel(hotel);

        const updateHotel = await Hotel.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Hotel actualizado exitosamente!!",
            updateHotel
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar hotel",
            error: error.message
        })
    }
}

export const deleteHotel = async (req, res = response) => {
    try {
        
        const { id } = req.params;

        await existeHotelById(id);

        const hotel = await Hotel.findById(id);
        await soloAdminHotel(req);
        await statusHotel(hotel);

        const deleteHotel = await Hotel.findByIdAndUpdate(id, { status: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: "Hotel eliminado exitosamente!!",
            deleteHotel
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar hotel",
            error: error.message
        })
    }
}