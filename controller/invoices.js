const Invoices = require("../models/invoices");
const PDFDocument = require("pdfkit");


exports.getPatientInvoices = async (req, res) => {
  try {
    const invoices = await Invoices.find({ patientId: req.userId }).sort({ date: -1 });

    res.status(200).json({ invoices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching invoices" });
  }
};

exports.getAllInv = async (req, res, next) => {
  if (!req.role === "admin") {
    return res
      .status(404)
      .json({ message: "you aren't allowed to see this page" });
  }
  const allInv = await Invoices.find();
  if (!allInv) {
    return res.status(404).json({ message: "no invoices yet" });
  }
  res.status(201).json({ message: "all the invoices", allInv });
};

exports.getOneInv = async (req, res, next) => {
  if (!req.role) {
    return res
      .status(404)
      .json({ message: "you aren't allowed to see this page" });
  }
  const InvId = req.params.InvId;

  const Inv = await Invoices.findById(InvId);
  if (!Inv) {
    return res.status(404).json({ message: "no invoices" });
  }

  res.status(201).json({ message: " the invoices", Inv });
};

exports.newInv = async (req, res, next) => {
  const { patientId, status, amount } = req.body;
  const newInvoice = new Invoices({
    patientId,
    status,
    amount,
  });
  await newInvoice.save();
  res
    .status(201)
    .json({ message: " the invoices has been created", newInvoice });
};

exports.deleteInv = async (req, res, next) => {
  const InvId = req.params.InvId;
  if (!InvId) {
    return res.status(404).json({ message: "no invoices to delete" });
  }
  await Invoices.findByIdAndDelete(InvId);
};

exports.editInv = async (req, res, next) => {
  const InvId = req.params.InvId;
  if (!InvId) {
    return res.status(404).json({ message: "no invoices to edit" });
  }
  const { patientId, status, amount } = req.body;
  const updateInv = await Invoices.findById(InvId);
  updateInv.patientId = patientId || updateInv.patientId;
  updateInv.status = status || updateInv.status;
  updateInv.amount = amount || updateInv.amount;
  await updateInv.save();
  res
    .status(201)
    .json({ message: " the invoices has been updated ", updateInv });
};

exports.DownloadInv = async (req, res, next) => {
  const InvId = req.params.InvId;
  const invoice = await Invoices.findById(InvId).populate("patientId");
  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=invoice-${invoice._id}.pdf`
  );
  doc.pipe(res);

  doc.fontSize(20).text("Invoice Details", { underline: true });
  doc.moveDown();
  doc.fontSize(14).text(`Patient Name: ${invoice.patientId.name}`);
  doc.text(`Patient Age: ${invoice.patientId.age}`);
  doc.text(`Doctor Name: ${invoice.patientId.doctorName}`);
  doc.text(`Amount: ${invoice.amount}`);
  doc.text(`Status: ${invoice.status}`);

  doc.end();
};