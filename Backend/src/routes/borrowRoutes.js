const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrowController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, borrowController.borrowBook);
router.post("/return", authMiddleware, borrowController.returnBook);
router.get("/my-borrows", authMiddleware, borrowController.getUserBorrows);

module.exports = router;
