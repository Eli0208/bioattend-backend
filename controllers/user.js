const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function registerUser(req, res) {
  const { username, password, name } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, name });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { username: user.username, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function addClass(req, res) {
  const {
    username,
    subjectCode,
    subjectDescription,
    timeIn,
    timeOut,
    year,
    section,
  } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the new class to the user's classes array
    user.classes.push({
      subjectCode,
      subjectDescription,
      timeIn,
      timeOut,
      year,
      section,
    });
    await user.save();

    res.status(200).json({ message: "Class added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function addClass(req, res) {
  const {
    username,
    subjectCode,
    subjectDescription,
    timeSlots, // Updated to handle an array of time slots
    year,
    section,
  } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Access the user's classes array and push the new class data
    user.classes.push({
      subjectCode,
      subjectDescription,
      timeSlots,
      year,
      section,
    });
    await user.save();

    res.status(200).json({ message: "Class added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getUserClasses(req, res) {
  const { username } = req.query; // Retrieve username from query parameters

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's classes
    res.status(200).json({ classes: user.classes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getSpecificClass(req, res) {
  const { classId } = req.query; // Retrieve classId from route parameters
  try {
    const user = await User.findOne({ "classes._id": classId }); // Find user with matching classId
    if (!user) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Find the specific class within the user's classes array
    const foundClass = user.classes.find(
      (cls) => cls._id.toString() === classId
    );
    if (!foundClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({ class: foundClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function enrollStudent(req, res) {
  const {
    classId,
    studentNo,
    username,
    studentFirstName,
    studentMiddleName,
    studentLastName,
  } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the class within the user's classes array by classId
    const selectedClass = user.classes.find(
      (cls) => cls._id.toString() === classId
    );
    if (!selectedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if the student is already enrolled
    if (
      selectedClass.enrolledStudents.some(
        (student) => student.studentNo === studentNo
      )
    ) {
      return res.status(400).json({ message: "Student already enrolled" });
    }

    // Add the student to the enrolledStudents array
    selectedClass.enrolledStudents.push({
      studentNo: studentNo,
      studentFirstName: studentFirstName,
      studentMiddleName: studentMiddleName,
      studentLastName: studentLastName,
    });

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Student enrolled successfully" });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  addClass,
  getUserClasses,
  getSpecificClass,
  enrollStudent,
};
