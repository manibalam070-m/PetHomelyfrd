import Appointment from '../models/Appointments.js';
import ErrorHandler from '../utils/errorHandler.js';
import sendEmail from '../utils/sendEmail.js';

export const createAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({
      ...req.body, user: req.user?._id,
    });
    try {
      await sendEmail({
        email: appointment.email,
        subject: 'Appointment Confirmation 🐾',
        message: `<h2>Hi ${appointment.ownerName}</h2>
          <p>Your appointment for <b>${appointment.service}</b> on 
          <b>${new Date(appointment.date).toDateString()}</b> at <b>${appointment.time}</b> is received.</p>`,
      });
    } catch (e) { console.log('Email err:', e.message); }
    res.status(201).json({ success: true, appointment });
  } catch (error) { next(error); }
};

export const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, appointments });
  } catch (error) { next(error); }
};

export const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find().sort('-createdAt');
    res.status(200).json({ success: true, appointments });
  } catch (error) { next(error); }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return next(new ErrorHandler('Appointment not found', 404));
    appt.status = req.body.status;
    await appt.save();
    res.status(200).json({ success: true, appointment: appt });
  } catch (error) { next(error); }
};