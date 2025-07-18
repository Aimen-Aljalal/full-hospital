const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "senderModel", 
  },
  senderModel: {
    type: String,
    required: true,
    enum: ["Patient", "Doctor"], 
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "receiverModel", 
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ["Patient", "Doctor"], 
  },
  roomId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);