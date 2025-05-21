import Room from "../rooms/room.model.js";
import Hotel from "../hoteles/hotel.model.js";
import { request, response } from "express";
import {
    verificarHotelExistente,
    validarDatosRoom,
    noAgregarRoomRepetida,
    existeRoomById,
    soloAdminHotel,
    verificarCantidadHabitaciones
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
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Error al crear la habitación",
            error: error.message
        });
    }
};

export const getByType = async (req, res) => {
    try {
        const { type } = req.params;
        const rooms = await Room.find({ type });
        return res.status(200).json({
            success: true,
            msg: "Habitaciones obtenidas exitosamente",
            rooms
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: "Error al obtener habitaciones", error: error.message });
    }
};

export const getByHotelName = async (req, res) => {
  try {
    const { name } = req.params;

   
    const hoteles = await Hotel.find({ name });

   
    const hotelIds = hoteles.map(h => h._id);

    
    const habitaciones = await Room.find({ hotel: { $in: hotelIds } }).populate("hotel");

    return res.status(200).json({
      success: true,
      msg: "Habitaciones obtenidas exitosamente por name",
      habitaciones
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: "Error al obtener habitaciones", error: error.message });
  }
};

export const updateRoom = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, quantity, hotel, type, name, ...data } = req.body || {};
        const { addQuantity, removeQuantity } = req.body || {};

        await soloAdminHotel(req);

        const room = await Room.findById(id);
        if (!room) throw new Error("La habitación no existe");

        const hotelId = room.hotel;

        const hotel1 = await Hotel.findById(hotelId);

        if (addQuantity) {
            await Hotel.findByIdAndUpdate(hotelId, {
                $inc: { habitacionesDisponibles: addQuantity }
            });
        }

        if (removeQuantity) {
            await verificarCantidadHabitaciones(hotel1, removeQuantity);
            await Hotel.findByIdAndUpdate(hotelId, {
                $inc: { habitacionesDisponibles: -removeQuantity }
            });
        }

        const updateRoom = await Room.findByIdAndUpdate(id, data, { new: true });

        return res.status(200).json({
            success: true,
            msg: "Habitación actualizada correctamente",
            updateRoom
        });
    } catch (error) {
        console.log(error);
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
