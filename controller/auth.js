const bycrpt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/users");
const Doctor = require("../models/doctor");
const Patient = require("../models/patients");

const jwt = require("jsonwebtoken");

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "signing up not valid",
      errors: errors.array(),
    });
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const role = req.body.role;
  const schedule = req.body.schedule || ["7am - 2pm", "5pm - 10pm"];
  try {
    const isExist = await User.findOne({ email: email });
    if (isExist) {
      return res.status(422).json({ message: `this user is already Exist` });
    }
    const hashedPass = await bycrpt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPass,
      name: name,
      role: role,
    });
    res.status(201).json({ message: `user is created`, userId: user._id });
    await user.save();
    if (user.role === "doctor") {
      const doctor = new Doctor({
        specialization: "good doctor",
        contact: user.email,
        schedule: schedule,
        name: user.name,
        doctorId: user._id,
      });
      await doctor.save();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `a problem in creating user` });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await Doctor.findOne({ contact: email });
    let role = "doctor";

    if (!user) {
      user = await Patient.findOne({ contact: email });
      role = "patient";
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bycrpt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        role: role,
      },
      "SuperSuperKey",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role,
      name: user.name,
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
};
