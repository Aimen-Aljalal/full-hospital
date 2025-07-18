const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const doctorController = require("../controller/doctor");

const isAuth = require("../middleware/auth");

router.get("/allDoc", doctorController.getAllDoctors);

router.get("/doctor/:docId", isAuth, doctorController.getOneDoc);

router.patch("/editDoctor/:docId", isAuth, doctorController.editDoctor);

router.delete("/deleteDoctor/:docId", isAuth, doctorController.deleteDoctor);
router.post(
  "/addDoctor",
  [
    body("name").notEmpty(),
    body("contact").isEmail(),
    body("password").isLength({ min: 3 }),
    body("specialization").notEmpty(),
    body("schedule").isArray(),
  ],
  doctorController.addDoctor
);

module.exports = router;
