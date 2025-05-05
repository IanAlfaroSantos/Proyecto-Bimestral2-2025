import { Schema, model } from "mongoose";

const UserSchema = Schema({
    name: {
        type: String,
        required: [ true, "El nombre es requerido" ],
        maxlength: [ 25, "El nombre tiene más de 25 caracteres" ],
        lowercase: true
    },
    surname: {
        type: String,
        required: [ true, "El apellido es requerido" ],
        maxlength: [ 25, "El nombre tiene más de 25 caracteres" ]
    },
    username: {
        type: String,
        unique: [ true, "El username ingresado ya existe en la base de datos" ],
        required: [ true, "El username es requerido" ],
        lowercase: true
    },
    email: {
        type: String,
        required: [ true, "El email es requerido" ],
        unique: [ true, "El email ingresado ya existe en la base de datos" ],
        lowercase: true
    },
    password: {
        type: String,
        required: [ true, "La contraseña es requerida" ]
    },
    phone: {
        type: String,
        required: [ true, "El número de telefono es requerido" ]
    },
    role: {
        type: String,
        enum: [ "ADMIN_WEB", "ADMIN_HOTEL", "USER" ],
        default: "USER"
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject()
    user.uid = _id
    return user
}

export default model("User", UserSchema);