import Reservacion from '../reservaciones/reservacion.model.js';
import User from '../users/user.model.js';
import Room from '../rooms/room.model.js';
import Hotel from '../hoteles/hotel.model.js';
import Evento from '../eventos/evento.model.js';

export const validarIdReservacion = async (id = ' ') => {
    const existeReservacion = await Reservacion.findOne({ id });

    if (!existeReservacion) {
        throw new Error(`Reservacion "${id}" no existe en la base de datos!`);
    }
}

export const validarNombreUsuario = async (name = ' ') => {
    const usuario = await User.findOne({ name });

    if (!usuario) {
        throw new Error(`User con nombre "${name}" no encontrado!`);
    }

    return usuario;
};

export const validarRoom = async (id = ' ') => {
    const habitacion = await Room.findById(id);

    if (!habitacion) {
        throw new Error(`Habitación con ID "${id}" no encontrada!`);
    }

    if (habitacion.hotel.toString() !== id.toString()) {
        throw new Error(`La habitación ${id} no pertenece al hotel ingresado!`);
    }

    if (!habitacion.status) {
        throw new Error(`La habitación ${id} ya está ocupada y se desocupa en: ${habitacion.fechaDesocupacion || 'una fecha no definida!'}`);
    }

    return habitacion;
};

export const validarNombreHotel = async (name = ' ') => {
    const hotel = await Hotel.findOne({ name });

    if (!hotel) {
        throw new Error(`Hotel con nombre "${name}" no encontrado!`);
    }

    return hotel;
};

export const validarIdEvento = async (id = ' ') => {
    const evento = await Evento.findById(id);

    if (!evento) {
        throw new Error(`Evento con ID "${id}" no encontrado!`);
    }

    if (evento.hotel.toString() !== id.toString()) {
        throw new Error(`El evento ${id} no pertenece al hotel ingresado!`);
    }

    return evento;
};