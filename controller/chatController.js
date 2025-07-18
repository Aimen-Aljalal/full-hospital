const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  const { roomId } = req.params;
  const userId = req.userId; 

  try {
    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const roomMessages = await Message.find({
      roomId,
      $or: [
        { senderId: userId, senderModel: { $in: ["Patient", "Doctor"] } },
        { receiverId: userId, receiverModel: { $in: ["Patient", "Doctor"] } },
      ],
    }).sort({ sentAt: 1 });

    res.status(200).json({ messages: roomMessages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

exports.clearMessages = async (req, res) => {
  const { roomId } = req.params;
  const userId = req.userId;

  try {
    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const result = await Message.deleteMany({
      roomId,
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    });

    res.status(200).json({ message: "done deleting it", deletedCount: result.deletedCount });
  } catch (err) {
    console.error("Error deleting messages:", err);
    res.status(500).json({ message: " error deleting " });
  }
};