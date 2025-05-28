import { Schema, model } from "mongoose";

const EventoSchema = Schema({
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: [true, "El hotel es requerido!"]
    },

    tipoSala: {
        type: String,
        enum: ['ALTA CALIDAD', 'MEDIA CALIDAD', 'BAJA CALIDAD'],
        required: [true, "El tipo de sala es requerido!"]
    },

    numeroSalas: {
        type: Number,
        required: [true, "El número de salas es requerido!"],
        min: [0, 'El número de salas no puede ser negativo!']
    },

    precio: {
        type: Number,
        required: [true, "El precio es requerido!"],
        min: [0.01, "El precio debe ser mayor que 0!"]
    },
    imagen: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    }

}, {
    timestamps: true,
    versionKey: false
});

export default model('Evento', EventoSchema);