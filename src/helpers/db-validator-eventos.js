import Evento from '../eventos/evento.model.js';

export const validarIdEvento = async (id = ' ') => {
    const existeEvento = await Evento.findOne({ id });

    if (!existeEvento) {
        throw new Error(`Evento "${id}" no existe en la base de datos!`);
    }
}