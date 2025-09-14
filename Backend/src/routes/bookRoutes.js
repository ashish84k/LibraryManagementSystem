const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, bookController.getBooks);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["Admin"]),
  bookController.createBook
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  bookController.updateBook
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["Admin"]),
  bookController.deleteBook
);

module.exports = router;
