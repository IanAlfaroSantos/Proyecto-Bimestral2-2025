import { Schema, model } from "mongoose";

const HotelSchema = Schema({
    name: {
        type: String,
        required: [ true, "El nombre es requerido" ],
        maxlength: [ 25, "El nombre tiene más de 25 caracteres" ],
        unique: [ true, "El nombre ingresado ya existe" ],
        lowercase: true
    },
    direccion: {
        type: String,
        required: [ true, "La dirección es requerida" ],
        maxlength: [ 200, "La dirección tiene más de 200 caracteres" ]
    },
    categoria: {
        type: String,
        required: [ true, "La categoria es requerida" ],
        enum: {
            values : ["1 estrella", "2 estrellas", "3 estrellas", "4 estrellas", "5 estrellas"],
            message: "El valor de la categoria debe ser uno de los siguientes: '1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas'"
        }
    },
    habitacionesDisponibles: {
        type: Number,
        default: 0
    },
    comodidades: {
        type: Number,
        required: [ true, "Las comodidades son requeridas" ]
    },
    salasDisponibles: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model("Hotel", HotelSchema);