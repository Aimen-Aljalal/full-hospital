const express = require("express");

const router = express.Router();

const InvController = require("../controller/invoices");

const isAuth = require("../middleware/auth");

router.get("/my-invoice", isAuth, InvController.getPatientInvoices);

router.post("/createInv", isAuth, InvController.newInv);

router.get("/allInv", InvController.getAllInv);

router.get("/oneInv/:InvId", InvController.getOneInv);

router.patch("/editInv/:InvId", InvController.editInv);

router.delete("/deleteInv/:InvId", InvController.deleteInv);

router.get("/download/:InvId", InvController.DownloadInv);

module.exports = router;
