const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const socket = require("./Socket");
const http = require("http");

const authRouter = require("./routes/AuthRoutes");
// const userRouter = require("./routes/UserRoutes");
const chatRoutes = require("./routes/chatRoutes");
const PatientRouter = require("./routes/Patients");
const DoctorRouter = require("./routes/Doctors");
const appointmentRouter = require("./routes/appointment");
const InvoicesRouter = require("./routes/invoices");

const path = require("path");

const multer = require("multer");

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE", "PATCH"],
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message || "there is an Error";
  res.status(status).json({ message: message });
});

const URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.w0tz2.mongodb.net/fullHospital?retryWrites=true&w=majority&appName=Cluster0`;

app.use("/auth", authRouter);

// app.use("/users", userRouter);

app.use("/patients", PatientRouter);

app.use("/doctors", DoctorRouter);

app.use("/chat", chatRoutes);


app.use("/appointments", appointmentRouter);

app.use("/Inv", InvoicesRouter);

mongoose
  .connect(URI)
  .then(() => {
    socket.init(server);
    server.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
