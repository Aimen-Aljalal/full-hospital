const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
  type: String,
  required: true,
},
  contact: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  medicalHistory: {
    type: [String],
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  role: {
  type: String,
  default: "patient",
}
});

module.exports = mongoose.model("Patient", patientSchema);
