import Evento from '../eventos/evento.model.js';
import Hotel from '../hoteles/hotel.model.js';

export const validarIdEvento = async (id = ' ') => {
    const existeEvento = await Evento.findOne({ _id: id });

    if (!existeEvento) {
        throw new Error(`Evento "${id}" no existe en la base de datos!`);
    }
}

export const validarHotelExistente = async (nombreHotel) => {
    const hotel = await Hotel.findOne({ name: nombreHotel.toLowerCase() });
    if (!hotel) {
        throw new Error('Hotel no encontrado!');
    }
    return hotel;
};

export const noAgregarEventoRepetido = async (hotelId, tipoSala) => {
    const existing = await Evento.findOne({ hotel: hotelId, tipoSala });
    if (existing) {
        throw new Error("Ya existe un Evento de este tipo para el hotel. Actualicela");
    }
};