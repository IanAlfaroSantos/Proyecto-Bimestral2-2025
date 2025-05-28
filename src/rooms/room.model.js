import { Schema, model, Types } from "mongoose";

const RoomSchema = Schema({
    hotel: {
        type: Schema.Types.ObjectId,
        ref: "Hotel",
        required: [true, "El hotel es requerido"]
    },
    type: {
        type: String,
        enum: ["alta", "media", "baja"],
        required: [true, "El tipo de habitación es requerido"]
    },
    quantity: {
        type: Number,
        required: [true, "El número de habitaciones es requerido"],
        min: [1, "Debe haber al menos una habitación"]
    },
    addQuantity: {
        type: Number,
        default: 0
    },
    removeQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "El precio es requerido"],
        min: [1, "El precio no puede ser 0"]
    },
    imagen: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

RoomSchema.methods.toJSON = function () {
    const { _id, ...room } = this.toObject();
    room.uid = _id;
    return room;
};

export default model("Room", RoomSchema);