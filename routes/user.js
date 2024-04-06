const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  addClass,
  getUserClasses,
  getSpecificClass,
  enrollStudent,
} = require("../controllers/user");

// Route for user registration
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

// Route for adding a class to a user's profile
router.post("/addclass", addClass);

router.get("/getclass", getUserClasses);
router.get("/class", getSpecificClass);
router.post("/enroll", enrollStudent);

module.exports = router;
