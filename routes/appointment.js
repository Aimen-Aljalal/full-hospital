const express = require("express");

const router = express.Router();

const isAuth = require("../middleware/auth");

const appoinstmentsController = require("../controller/appointment");

router.get(
  "/allAppointments",
  isAuth,
  appoinstmentsController.getAllAppointments
);
router.post("/newAppointment", appoinstmentsController.newAppointment);

router.get("/appointment/:apId", appoinstmentsController.getOneAp);

router.patch("/editAp/:apId", isAuth, appoinstmentsController.editAp);

router.post("/book", isAuth, appoinstmentsController.bookAppointment);
router.get("/my", isAuth, appoinstmentsController.getAppointmentsForDoctor);
router.get("/my-appointments", isAuth, appoinstmentsController.getAppointmentsForPatient);
router.put("/update-status/:id", isAuth, appoinstmentsController.updateAppointmentStatus);
router.delete("/cancel/:id", isAuth, appoinstmentsController.cancelAppointment);




module.exports = router;
