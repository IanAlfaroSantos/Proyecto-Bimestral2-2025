import User from "../users/user.model.js";
import Hotel from "../hoteles/hotel.model.js";
import Room from "../rooms/room.model.js";
import Evento from "../eventos/evento.model.js";
import Reservacion from "../reservaciones/reservacion.model.js";

export const validarUsuarioYHotel = async (nombreUsuario, nombreHotel) => {
    const usuario = await User.findOne({ username: nombreUsuario.toLowerCase() });
    const hotel = await Hotel.findOne({ name: nombreHotel.toLowerCase() });

    if (!usuario || !hotel) {
        return { error: 'Usuario u hotel no encontrados!' };
    }

    return { usuario, hotel };
};

export const validarHabitaciones = async (habitaciones, hotelId) => {
    const habitacionesInvalidas = [];

    for (const id of habitaciones) {
        const habitacion = await Room.findById(id);

        if (!habitacion) {
            habitacionesInvalidas.push(id);
            continue;
        }

        if (!habitacion.status) {
            return {
                success: false,
                message: `La habitación con ID ${id} está ocupada!`
            };
        }

        if (habitacion.hotel.toString() !== hotelId.toString()) {
            return {
                success: false,
                message: `La habitación con ID ${id} no pertenece al hotel seleccionado!`
            };
        }
    }

    if (habitacionesInvalidas.length > 0) {
        return {
            success: false,
            message: `Una o más habitaciones no existen: ${habitacionesInvalidas.join(", ")}.`
        };
    }

    return null;
};

export const validarEventos = async (eventos, hotelId) => {
    const eventosInvalidos = [];

    for (const id of eventos) {
        const evento = await Evento.findById(id);

        if (!evento) {
            eventosInvalidos.push(id);
            continue;
        }

        if (!evento.status) {
            const reservacionExistente = await Reservacion.findOne({
                eventos: evento._id,
                status: true,
            }).sort({ fechaDesocupacion: -1 });

            return {
                success: false,
                message: `El evento con ID ${id} está ocupado!` +
                    (reservacionExistente?.fechaDesocupacion
                        ? ` Se desocupa en: ${reservacionExistente.fechaDesocupacion}.`
                        : '')
            };
        }

        if (evento.hotel.toString() !== hotelId.toString()) {
            return {
                success: false,
                message: `El evento con ID ${id} no pertenece al hotel seleccionado!`
            };
        }
    }

    if (eventosInvalidos.length > 0) {
        return {
            success: false,
            message: `Uno o más eventos no existen: ${eventosInvalidos.join(", ")}.`
        };
    }

    return null;
};