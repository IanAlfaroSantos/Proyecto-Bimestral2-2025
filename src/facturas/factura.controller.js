import mongoose from "mongoose";
import Factura from "../facturas/factura.model.js";
import Reservacion from "../reservaciones/reservacion.model.js";
import Room from "../rooms/room.model.js";
import Evento from "../eventos/evento.model.js";

export const postFactura = async (req, res) => {
  try {
    const { reservacionId } = req.body;

    const reservacion = await Reservacion.findById(reservacionId)
      .populate("nombreUsuario")
      .populate("nombreHotel")
      .populate("habitaciones")
      .populate("eventos");

    if (!reservacion) {
      return res.status(404).json({ message: "Reservación no encontrada" });
    }

    const fechaInicio = new Date(reservacion.fechaOcupacion);
    const fechaFin = new Date(reservacion.fechaDesocupacion || new Date());
    const milisegundosPorDia = 1000 * 60 * 60 * 24;
    const dias = Math.ceil((fechaFin - fechaInicio) / milisegundosPorDia);

    let totalHabitaciones = 0;
    reservacion.habitaciones.forEach(room => {
      totalHabitaciones += room.price * dias;
    });

    let totalEventos = 0;
    reservacion.eventos.forEach(evento => {
      totalEventos += evento.precio * 1;
    });

    const total = totalHabitaciones + totalEventos;

    const nuevaFactura = new Factura({
      user: reservacion.nombreUsuario._id,
      hotel: reservacion.nombreHotel._id,
      reservacion: reservacion._id,
      dias,
      horas: reservacion.eventos.length,
      total
    });

    await nuevaFactura.save();

    const facturaPopulada = await Factura.findById(nuevaFactura._id)
      .populate("user", "-password")
      .populate("hotel")
      .populate({
        path: "reservacion",
        populate: [
          { path: "nombreUsuario", select: "-password" },
          { path: "nombreHotel" },
          { path: "habitaciones" },
          { path: "eventos" }
        ]
      });

    res.status(201).json({
      message: "Factura creada correctamente",
      factura: facturaPopulada
    });

  } catch (error) {
    console.error("Error al crear factura:", error);
    res.status(500).json({
      message: "Error al generar la factura",
      error: error.message
    });
  }
};


export const getFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find()
      .populate("user", "-password")
      .populate("hotel")
      .populate({
        path: "reservacion",
        populate: [
          { path: "nombreUsuario", select: "-password" },
          { path: "nombreHotel" },
          { path: "habitaciones" },
          { path: "eventos" }
        ]
      });

    res.status(200).json({
      message: "Facturas obtenidas correctamente",
      facturas
    });

  } catch (error) {
    console.error("Error al obtener facturas:", error);
    res.status(500).json({
      message: "Error al obtener las facturas",
      error: error.message
    });
  }
};

export const getFacturasByUser = async (req, res) => {
  try {
    const userId = req.user._id; // Asegura tipo correcto

    console.log("Usuario autenticado:", req.user);

    const facturas = await Factura.find({ user: userId })
      .populate("user", "-password")
      .populate("hotel")
      .populate({
        path: "reservacion",
        populate: [
          { path: "nombreUsuario", select: "-password" },
          { path: "nombreHotel" },
          { path: "habitaciones" },
          { path: "eventos" }
        ]
      });

    res.status(200).json({
      message: "Facturas del usuario obtenidas correctamente",
      facturas
    });

  } catch (error) {
    console.error("Error al obtener facturas del usuario:", error);
    res.status(500).json({
      message: "Error al obtener las facturas del usuario",
      error: error.message
    });
  }
};

