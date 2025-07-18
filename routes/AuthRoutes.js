const express = require("express");

const router = express.Router();

const { body } = require("express-validator");

const authController = require("../controller/auth");


router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .isLength({ min: 5 })
      .trim()
      .withMessage(`email isn't valid`),
    body("password").trim().isLength({ min: 3 }),
    body("role").isIn(["admin", "doctor", "patient", "nurse"]),
  ],
  authController.signUp
);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .isLength({ min: 5 })
      .trim()
      .withMessage(`email isn't valid`),
    body("password").trim().isLength({ min: 3 }),
  ],
  authController.login
);


module.exports = router;
