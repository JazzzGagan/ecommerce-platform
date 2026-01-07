const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  register,
  login,
  logOut,
} = require("../controllers/auth/authControllers");

router.post("/register", upload.single("image"), register);
router.post("/login", login);
router.post("/logout", logOut);

module.exports = router;


