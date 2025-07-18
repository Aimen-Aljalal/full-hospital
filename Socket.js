let io;

const Message = require("./models/Message");

module.exports = {
  init: (server) => {
    io = require("socket.io")(server, {
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("connected", socket.id);

      socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`user ${socket.id} joined room ${roomId}`);
      });

      socket.on(
        "chatMessage",
        async ({
          roomId,
          message,
          senderId,
          receiverId,
          senderModel,
          receiverModel,
        }) => {
          try {
            if (
              !roomId ||
              !message ||
              !senderId ||
              !receiverId ||
              !senderModel ||
              !receiverModel
            ) {
              throw new Error("Missing required fields");
            }
            const newMessage = new Message({
              senderId,
              receiverId,
              senderModel,
              receiverModel,
              roomId,
              message,
            });
            await newMessage.save();

            io.to(roomId).emit("chatMessage", {
              senderId,
              message,
              sentAt: newMessage.sentAt,
            });
          } catch (err) {
            console.error("Error saving chat message:", err);
            socket.emit("error", { message: "Failed to send message" });
          }
        }
      );

      socket.on("sendNotification", ({ receiverId, notify }) => {
        io.to(receiverId).emit("sendingNotification", notify);
      });
      socket.on("registerUserRoom", (userId) => {
        socket.join(userId);
        console.log(`User ${socket.id} joined personal room ${userId}`);
      });

      socket.on("disconnect", () => {
        console.log("user is offline", socket.id);
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw Error("Socket.io not initialized");
    }
    return io;
  },
};
