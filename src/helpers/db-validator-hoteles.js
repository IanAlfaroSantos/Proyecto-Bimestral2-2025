import Hotel from "../hoteles/hotel.model.js";

export const existeHotelById = async (id = '') => {

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }

    const existeHotel = await Hotel.findById(id);

    if (!existeHotel) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const statusHotel = async (hotel) => {

    if (hotel.status === false) {
        throw new Error(`Hotel no disponible`);
    }
}

export const verificarHotelExistente = async ( name, hotel )  => {
    if (name && name !== hotel.name) {
        const existingHotel = await Hotel.findOne({name});

        if (existingHotel && existingHotel.id !== hotel.id) {
            throw new Error(`El nombre del Hotel ${ name } ya existe en la base de datos`)
        } 
    }
}

export const soloAdminHotel = async ( req )  => {
    if (req.user.role !== "ADMIN_HOTEL") {
        throw new Error(`Solo los ADMIN_HOTEL pueden agregar, editar y eliminar hoteles`)
    }
}