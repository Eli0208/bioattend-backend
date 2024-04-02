const moment = require("moment-timezone");
const Student = require("../models/Student");

const registerStudent = async (req, res) => {
  try {
    const {
      studentNo,
      studentFirstName,
      studentMiddleName,
      studentLastName,
      year,
      section,
      fingerprint,
    } = req.body;

    const newStudent = new Student({
      studentNo,
      studentFirstName,
      studentMiddleName,
      studentLastName,
      year,
      section,
      fingerprint,
      timeEntries: [],
    });

    const savedStudent = await newStudent.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const recordTimeIn = async (req, res) => {
  const fingerprint = req.body.fingerprint;
  try {
    const student = await Student.findOne({ fingerprint });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const latestTimeEntry = student.timeEntries[student.timeEntries.length - 1];

    const currentTime = moment.tz("Asia/Manila").toDate(); // Get current time in Manila timezone
    const timeEntry = { timeIn: currentTime };

    if (latestTimeEntry && !latestTimeEntry.timeOut) {
      await recordTimeOut(fingerprint);
      return res.status(200).json({
        message: "Time out recorded for student",
        student: updatedStudent,
      });
    } else {
      student.timeEntries.push(timeEntry);
      await student.save();
      return res
        .status(200)
        .json({ message: "Time in recorded for student", student });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const recordTimeOut = async (fingerprint) => {
  try {
    const student = await Student.findOne({ fingerprint });

    if (!student) {
      console.log("Student not found");
      return;
    }

    const latestTimeEntry = student.timeEntries[student.timeEntries.length - 1];
    if (latestTimeEntry && !latestTimeEntry.timeOut) {
      latestTimeEntry.timeOut = moment.tz("Asia/Manila").toDate(); // Update timeOut with current time in Manila timezone
      await student.save();
    }
  } catch (error) {
    console.error("Error recording time out:", error.message);
  }
};

module.exports = {
  registerStudent,
  getAllStudents,
  recordTimeIn,
  recordTimeOut,
};
