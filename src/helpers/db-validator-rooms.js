import Hotel from "../hoteles/hotel.model.js";
import Room from "../rooms/room.model.js";


export const existeRoomById = async (id = '') => {

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }

    const existeRoom = await Room.findById(id);

    if (!existeRoom) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
};

export const verificarHotelExistente = async (hotelId) => {
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
        throw new Error("El hotel no existe");
    }
};

export const verificarCantidadHabitaciones = async (hotel1, removeQuantity) => {
    if (removeQuantity > hotel1.habitacionesDisponibles) {
        throw new Error(`No hay suficientes habitaciones en el hotel para eliminar, solo hay: ${hotel1.habitacionesDisponibles}`);
    }
};

export const validarDatosRoom = async (quantity, price) => {
    if (quantity <= 0) {
        throw new Error("La cantidad de habitaciones debe ser mayor a 0!!!");
    }

    if (price < 1) {
        throw new Error("El precio debe ser al menos 1");
    }
};

export const noAgregarRoomRepetida = async (hotelId, type) => {
    const existing = await Room.findOne({ hotel: hotelId, type });
    if (existing) {
        throw new Error("Ya existe una habitación de este tipo para el hotel. Actualicela");
    }
};

export const soloAdminHotel = async ( req )  => {
    if (req.user.role !== "ADMIN_HOTEL") {
        throw new Error(`Solo los ADMIN_HOTEL pueden agregar, editar y eliminar hoteles`)
    }
};
