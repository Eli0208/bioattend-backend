const express = require("express");
const router = express.Router();
const {
  registerStudent,
  getAllStudents,
  recordTime,
  getStudents,
  getStudentByStudentNo,
  editStudentById,
  deleteStudentById,
} = require("../controllers/student");

// POST /api/register
router.post("/register", registerStudent);

// GET /api/students
router.get("/students", getAllStudents);
router.get("/studentsection", getStudents);

// POST /api/record-time-in
router.post("/record-time-in", recordTime);

router.get("/:studentNo", getStudentByStudentNo);
router.put("/editstudent/:id", editStudentById);
router.delete("/deletestudent/:id", deleteStudentById);

module.exports = router;
