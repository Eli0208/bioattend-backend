const express = require("express");
const router = express.Router();
const {
  registerStudent,
  getAllStudents,
  recordTimeIn,
  recordTimeOut,
  getStudents,
} = require("../controllers/student");

// POST /api/register
router.post("/register", registerStudent);

// GET /api/students
router.get("/students", getAllStudents);
router.get("/studentsection", getStudents);

// POST /api/record-time-in
router.post("/record-time-in", recordTimeIn);

// POST /api/record-time-out
router.post("/record-time-out", recordTimeOut);

module.exports = router;
