const express = require("express");
const isAuth = require("../middleware/auth");
const chatController = require("../controller/chatController");
const router = express.Router();


router.get("/messages/:roomId", isAuth, chatController.getMessages);

router.delete("/messages/:roomId", isAuth, chatController.clearMessages);


module.exports = router;