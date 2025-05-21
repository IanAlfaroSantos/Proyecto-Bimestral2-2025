import reservacionModel from '../reservaciones/reservacion.model.js';
import hotelModel from '../hoteles/hotel.model.js';

 

export const getInformeDemandaHoteles = async (req, res) => {
    try {

        const hoteles = await hotelModel.find();
        const estadisticas = await Promise.all(
            hoteles.map(async (hotel) => {
                const totalReservaciones = await reservacionModel.countDocuments({ nombreHotel: hotel._id });
                const habitacionesOcupadas = await reservacionModel.aggregate([
                    { $match: { nombreHotel: hotel._id } },
                    { $unwind: '$habitaciones' },
                    { $count: 'total' }
                ]);

                return {
                    hotel: hotel.name,
                    totalReservaciones,
                    habitacionesOcupadas: habitacionesOcupadas[0]?.total || 0
                };
            })
        );

        res.status(200).json({
            success: true,
            estadisticas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al generar el informe de demanda de hoteles',
            error: error.message
        });
    }
}


export const getInformeReservacionesPorHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;

      
        const hotel = await hotelModel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: 'Hotel no encontrado'
            });
        }

     
        const reservaciones = await reservacionModel.find({ nombreHotel: hotelId })
            .populate('nombreUsuario', 'name surname')
            .populate('habitaciones', 'type price')
            .populate('eventos', 'tipoSala precio');

        res.status(200).json({
            success: true,
            hotel: hotel.name,
            totalReservaciones: reservaciones.length,
            reservaciones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al generar el informe de reservaciones por hotel',
            error: error.message
        });
    }
};
