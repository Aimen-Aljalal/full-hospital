const Doctors = require("../models/doctor");
const Patients = require("../models/patients");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.getAllDoctors = async (req, res, next) => {
  try {
    const allDoc = await Doctors.find().select("name specialization contact");

    if (allDoc.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }

    res.status(200).json({ message: "Found all doctors", allDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.getOneDoc = async (req, res, next) => {
//   const DocId = req.params.docId;
//   if (!DocId) {
//     return res.status(404).json({ message: "no doctors found" });
//   }

//   const doctor = await Doctors.findById(DocId);
//   res.status(200).json({ message: "found the doctor", doctor });
// };

// exports.editDoctor = async (req, res, next) => {
//   const { name, contact, specialization, schedule } = req.body;

//   const docId = req.params.docId;
//   const doc = await Doctors.findById(docId);

//   if (doc.doctorId.toString() !== req.userId.toString()) {
//     if (!req.role == "admin") {
//       return res
//         .status(404)
//         .json({ message: "you are not allowed to do that" });
//     }
//   }
//   doc.name = name || doc.name;
//   doc.contact = contact || doc.contact;
//   doc.specialization = specialization || doc.specialization;
//   doc.schedule = schedule || doc.schedule;
//   await doc.save();
//   res.status(200).json({ message: "done editing" });
// };

// exports.deleteDoctor = async (req, res, next) => {
//   if (!req.role == "admin") {
//     return res.status(404).json({ message: "you are not allowed to do that" });
//   }
//   const docId = req.params.docId;
//   await Doctors.findByIdAndDelete(docId);
//   res.status(200).json({ message: "doctor deleted" });
// };
exports.addDoctor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Doctor registration not valid",
      errors: errors.array(),
    });
  }

  const { name, contact, specialization, schedule, password } = req.body;

  try {
    const isDoctorExist = await Doctors.findOne({ contact });
    if (isDoctorExist) {
      return res
        .status(409)
        .json({ message: "This email already exists as doctor" });
    }

    const isPatientExist = await Patients.findOne({ contact });
    if (isPatientExist) {
      return res
        .status(409)
        .json({ message: "This email is already used by a patient" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newDoc = new Doctors({
      name,
      contact,
      specialization,
      schedule,
      password: hashedPassword,
      role: "doctor",
    });

    await newDoc.save();

    res.status(201).json({
      message: "Doctor created successfully",
      doctorId: newDoc._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while creating doctor" });
  }
};
