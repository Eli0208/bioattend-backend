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

const recordTime = async (req, res) => {
  const { fingerprint, room } = req.body; // Extract fingerprint and room from request body
  try {
    const student = await Student.findOne({ fingerprint });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const currentTime = moment.tz("Asia/Manila").toDate(); // Get current time in Manila timezone

    // Find the latest time entry with no corresponding time out
    const latestTimeEntry = student.timeEntries.find((entry) => !entry.timeOut);
    if (latestTimeEntry) {
      if (latestTimeEntry.room !== room) {
        latestTimeEntry.timeOut = currentTime;
        await student.save();
        const newTimeEntry = { timeIn: currentTime, room };
        student.timeEntries.push(newTimeEntry);
        await student.save();
      } else {
        latestTimeEntry.timeOut = currentTime;
        await student.save();
      }
    } else {
      console.log("iwascalled");
      const timeEntry = { timeIn: currentTime, room };
      student.timeEntries.push(timeEntry);
      await student.save();
    }

    return res
      .status(200)
      .json({ message: "Time recorded for student", student });
  } catch (error) {
    console.error("Error recording time:", error.message);
    return res.status(500).json({ message: "Error recording time" });
  }
};

const getStudents = async (req, res) => {
  try {
    // Extract year and section query parameters from request
    const { year, section } = req.query;

    // Define query object to filter students
    const query = {};

    // Add year and section filters if provided
    if (year) {
      query.year = year;
    }
    if (section) {
      query.section = section;
    }

    // Query the database to find students based on the filters
    const students = await Student.find(query);

    // Send the response with the filtered students
    res.status(200).json(students);
  } catch (error) {
    // Handle errors
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function getStudentByStudentNo(req, res) {
  const { studentNo } = req.params;

  try {
    const student = await Student.findOne({ studentNo });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const editStudentById = async (req, res) => {
  const { id } = req.params;
  const {
    studentNo,
    studentFirstName,
    studentMiddleName,
    studentLastName,
    year,
    section,
    fingerprint,
  } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        studentNo,
        studentFirstName,
        studentMiddleName,
        studentLastName,
        year,
        section,
        fingerprint,
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the student by ID and delete it
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete student", error: error.message });
  }
};

module.exports = {
  registerStudent,
  getAllStudents,
  recordTime,
  getStudents,
  getStudentByStudentNo,
  editStudentById,
  deleteStudentById,
};
