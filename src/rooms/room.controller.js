import Room from "../rooms/room.model.js";
import Hotel from "../hoteles/hotel.model.js";
import { request, response } from "express";
import {
    verificarHotelExistente,
    validarDatosRoom,
    noAgregarRoomRepetida,
    existeRoomById,
    soloAdminHotel
} from "../helpers/db-validator-rooms.js";

export const createRoom = async (req = request, res = response) => {
    try {
        const {type, quantity, price, hotelName} = req.body;

        const hotel = await Hotel.findOne({name: hotelName})
        await soloAdminHotel(req);
        await verificarHotelExistente(hotel);
        await validarDatosRoom(quantity, price);
        await noAgregarRoomRepetida(hotel, type);

        const newRoom = new Room({
            hotel: hotel._id,
            type,
            quantity,
            price
        });

        await newRoom.save();

        await Hotel.findByIdAndUpdate(hotel._id, {
            $inc: { habitacionesDisponibles: quantity }
        });

        return res.status(201).json({
            success: true,
            msg: "Habitación registrada exitosamente",
            room: newRoom
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            msg: "Error al crear la habitación",
            error: error.message
        });
    }
};

export const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        await existeRoomById(id);

        const room = await Room.findById(id).populate("hotel", "name");

        res.status(200).json({
            success: true,
            msg: "Room encontrada exitosamente!!",
            room
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al buscar room",
            error: error.message
        });
    }
};

export const updateRoom = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { type, quantity, price } = req.body;

        await soloAdminHotel(req);
        await validarDatosRoom(quantity, price);

        const room = await Room.findById(id);
        if (!room) throw new Error("La habitación no existe");

        room.type = type;
        room.quantity = quantity;
        room.price = price;

        await room.save();

        return res.status(200).json({
            success: true,
            msg: "Habitación actualizada correctamente",
            room
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar la habitación",
            error: error.message
        });
    }
};

export const getRooms = async (req = request, res = response) => {
    try {
        const rooms = await Room.find().populate("hotel", "name");

        return res.status(200).json({
            success: true,
            msg: "Habitaciones obtenidas exitosamente",
            rooms
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener habitaciones",
            error: error.message
        });
    }
};
