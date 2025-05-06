import { Schema, model } from "mongoose";

const ReservacionSchema = Schema({
    nombreUsuario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "El usuario es requerido!"]
    },

    nombreHotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: [true, "El hotel es requerido!"]
    },

    habitaciones: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Room',
            required: false
        }
    ],

    eventos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Evento',
            required: false
        }
    ],

    fechaOcupacion: {
        type: Date,
        default: Date.now,
        required: [true, "La fecha de ocupación es requerida!"]
    },

    fechaDesocupacion: {
        type: Date,
        required: false
    },

    status: {
        type: Boolean,
        default: true,
    }

}, {
    timestamps: true,
    versionKey: false
});

export default model('Reservacion', ReservacionSchema);