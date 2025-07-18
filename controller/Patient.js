const Patients = require("../models/patients");
const User = require("../models/users");
const Doctors = require("../models/doctor");
const bcrypt = require("bcryptjs");

exports.addPatient = async (req, res, next) => {
  const { name, age, gender, contact, medicalHistory, doctorId, password } =
    req.body;

  try {
    const doctor = await Doctors.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "No doctor found" });
    }

    const isExist = await Patients.findOne({ contact });
    if (isExist) {
      return res.status(409).json({ message: "Patient already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const patient = new Patients({
      name,
      age,
      gender,
      medicalHistory,
      contact,
      password: hashedPassword,
      doctorId: doctor._id,
      doctorName: doctor.name,
       role: "patient",
    });

    await patient.save();

    res.status(201).json({ message: "Patient added", patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong in adding patient" });
  }
};

exports.getAllPatients = async (req, res, next) => {
  const allPaitent = await Patients.find().select("medicalHistory name age");
  if (!allPaitent) {
    return res.status(404).json({ message: "no paitient here" });
  }
  res
    .status(200)
    .json({ message: "found all the paitent", allPaitent: allPaitent });
};

exports.getPatient = async (req, res, next) => {
  const patientId = req.params.patId;
  try {
    if (!patientId) {
      return res.status(404).json({ message: "no paitient here" });
    }
    const patient = await Patients.findById(patientId).select(
      "medicalHistory name age"
    );
    res.status(200).json({ message: "found the paitent", patient });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "no paitient here" });
  }
};

exports.editPaitent = async (req, res, next) => {
  if (!req.role || req.role === "patient") {
    return res.status(404).json({ message: "user can't do that" });
  }
  const patId = req.params.patId;
  if (!patId) {
    return res.status(404).json({ message: "no paitient here" });
  }
  try {
    const { name, gender, age, contact, medicalHistory, doctorName } = req.body;
    const patient = await Patients.findById(patId);
    patient.name = name || patient.name;
    patient.gender = gender || patient.gender;
    patient.age = age || patient.age;
    patient.contact = contact || patient.contact;
    patient.medicalHistory = medicalHistory || patient.medicalHistory;
    patient.doctorName = doctorName || patient.doctorName;
    await patient.save();
    res.status(200).json({ message: "done edit", patient: patient });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "problem in editing" });
  }
};

exports.editPatientProfile = async (req, res) => {
  try {
    const patient = await Patients.findById(req.userId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const { name, age, contact, medicalHistory, gender } = req.body;

    patient.name = name || patient.name;
    patient.age = age || patient.age;
    patient.contact = contact || patient.contact;
    patient.medicalHistory = medicalHistory || patient.medicalHistory;
    patient.gender = gender || patient.gender;

    await patient.save();

    res.status(200).json({ message: "Profile updated", patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPatientDetails = async (req, res) => {
  try {
    const patient = await Patients.findById(req.userId).populate("doctorId", "name specialization contact");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
       _id: patient._id,
      name: patient.name,
      medicalHistory: patient.medicalHistory,
      doctor: {
        name: patient.doctorId?.name,
        specialization: patient.doctorId?.specialization,
        contact: patient.doctorId?.contact,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.deletePaitent = async (req, res, next) => {
  if (!req.role || req.role === "patient") {
    return res.status(404).json({ message: "user can't do that" });
  }
  const patId = req.params.patId;
  if (!patId) {
    return res.status(404).json({ message: "no paitient here" });
  }
  await Patients.findByIdAndDelete(patId);
  res.status(200).json({ message: "patient has been deleted" });
};
