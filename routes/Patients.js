const express = require("express");

const router = express.Router();

const patientController = require("../controller/Patient");

const { body } = require("express-validator");


const isAuth = require("../middleware/auth");

router.post("/addPatient",   [
    body("name").notEmpty(),
    body("contact").isEmail(),
    body("password").isLength({ min: 3 }),
    body("gender").notEmpty(),
    body("medicalHistory").notEmpty(),
    body("age").notEmpty(),
  ], patientController.addPatient);

router.get("/allPatients", isAuth, patientController.getAllPatients);

router.get("/patient/:patId", isAuth, patientController.getPatient);

router.patch("/editPatient/:patId", isAuth, patientController.editPaitent);

router.get("/me", isAuth, patientController.getPatientDetails);

router.delete("/deletePatient/:patId", isAuth, patientController.deletePaitent);

router.put("/edit-profile", isAuth, patientController.editPatientProfile);


module.exports = router;
