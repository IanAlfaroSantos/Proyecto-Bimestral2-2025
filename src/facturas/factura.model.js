import {Schema, model} from 'mongoose'

const FacturaSchema = Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuario es requerido']
  },
  hotel:{
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Hotel es requerido']
  },
  reservacion:{
    type: Schema.Types.ObjectId,
    ref: 'Reservacion',
    required: [true, 'La reservacion es requerida']
  },
  fechaPago:{
    type: Date,
    default: Date.now
  },
  dias:{
    type: Number,
    min: [0, 'Los dias de hospedaje no pueden ser negativos']
  },
  horas:{
    type:Number,
    min: [0, 'Las horas de salas no pueden ser negativos']
  },
  total:{
    type: Number,
    required: [true, 'Total es requerido'],
    min: [0.01, "El total no puede ser 0"]
  },
  status:{
    type:Boolean,
    default: true
  }  
},{
    timestamps: true,
    versionKey: false
});

export default model('Factura', FacturaSchema);