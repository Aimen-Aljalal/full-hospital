const Patient = require("../models/patients");

const Doctor = require("../models/doctor");

const Appointment = require("../models/appoinstments");

const PDFDocument = require("pdfkit");
const invoices = require("../models/invoices");

exports.newAppointment = async (req, res, next) => {
  const { patientId, doctorId, date, status } = req.body;
  const patient = await Patient.findById(patientId);
  if (!patient) {
    return res.status(404).json({ message: "no patient found" });
  }
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: "no doctor found" });
  }
  const appointment = new Appointment({
    patientId,
    doctorId,
    date,
    status: status || "pending",
  });
  await appointment.save();
  res.status(201).json({ message: "Appointment created", appointment });
};

exports.getAllAppointments = async (req, res, next) => {
  console.log(req.role);
  if (!req.role || req.role === "patient") {
    return res
      .status(404)
      .json({ message: "you are not allowed to see this list" });
  }
  const allAppointments = await Appointment.find()
    .populate("patientId", "name")
    .populate("doctorId", "name");
  if (!allAppointments) {
    return res.status(404).json({ message: "no appointments found" });
  }
  res
    .status(201)
    .json({ message: " all the appointments Appointments", allAppointments });
};

exports.getOneAp = async (req, res, next) => {
  const apId = req.params.apId;
  if (!apId) {
    return res.status(404).json({ message: "no appointments found" });
  }
  const theOneAp = await Appointment.findById(apId)
    .populate("patientId", "name")
    .populate("doctorId", "name");
  if (!theOneAp) {
    return res.status(404).json({ message: "no appointments found" });
  }
  res.status(201).json({ message: " appointment details", theOneAp });
};

exports.editAp = async (req, res, next) => {
  if (!req.role || req.role === "patient") {
    return res
      .status(404)
      .json({ message: "you are not allowed to see this list" });
  }

  const apId = req.params.apId;
  if (!apId) {
    return res.status(404).json({ message: "no appointments found" });
  }
  const updatedAp = await Appointment.findById(apId);
  if (!updatedAp) {
    return res.status(404).json({ message: "no appointments found" });
  }
  const { patientId, doctorId, date, status } = req.body;

  updatedAp.patientId = patientId || updatedAp.patientId;
  updatedAp.doctorId = doctorId || updatedAp.doctorId;
  updatedAp.date = date || updatedAp.date;
  updatedAp.status = status || updatedAp.status;

  await updatedAp.save();
  res.status(200).json({ message: "appointment updated", updatedAp });
};

exports.deleteAp = async (req, res, next) => {
  if (!req.role == "admin") {
    return res.status(404).json({ message: "you are not allowed to do that" });
  }
  const apId = req.params.apId;
  await Appointment.findByIdAndDelete(apId);
  res.status(200).json({ message: "appointment deleted" });
};

exports.bookAppointment = async (req, res) => {
  try {
    const { date, reason } = req.body;
    const patient = await Patient.findById(req.userId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const appointment = new Appointment({
      patientId: req.userId,
      doctorId: patient.doctorId,
      date: new Date(date),
      reason,
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while booking" });
  }
};

exports.getAppointmentsForDoctor = async (req, res) => {
  try {
    if (req.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const appointments = await Appointment.find({ doctorId: req.userId })
      .populate({
        path: "patientId",
        model: "Patient",
        select: "name medicalHistory",
      })
      .sort({ date: -1 });
      console.log()

    res.status(200).json({ appointments });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getAppointmentsForPatient = async (req, res) => {
  try {
    if (req.role !== "patient") {
      return res.status(403).json({ message: "Access denied" });
    }

    const appointments = await Appointment.find({ patientId: req.userId })
      .populate({
        path: "doctorId",
        model: "Doctor",
        select: "name specialization",
      })
      .sort({ date: -1 });

    res.status(200).json({ appointments });
  } catch (err) {
    console.error("Error fetching patient appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateAppointmentStatus = async (req, res) => {
  try {
    if (req.role !== "doctor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const appointmentId = req.params.id;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: appointmentId, doctorId: req.userId },
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Status updated", appointment });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.patientId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await appointment.deleteOne();
    res.status(200).json({ message: "Appointment cancelled" });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
