const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorSchema = new Schema({
 
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  password: {
  type: String,
  required: true,
},

  schedule: {
    type: [String],
    required: true,
  },
  role: {
  type: String,
  default: "doctor",
}
});

module.exports = mongoose.model("Doctor", doctorSchema);
