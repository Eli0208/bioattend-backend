// models/Student.js

const mongoose = require("mongoose");

const timeEntrySchema = new mongoose.Schema({
  timeIn: { type: Date },
  timeOut: { type: Date },
});

const studentSchema = new mongoose.Schema({
  studentNo: { type: String, required: true },
  studentFirstName: { type: String, required: true },
  studentMiddleName: { type: String },
  studentLastName: { type: String, required: true },
  year: { type: String, required: true },
  section: { type: String, required: true },
  fingerprint: { type: String },
  timeEntries: [timeEntrySchema], // Array to store multiple time entries
});

module.exports = mongoose.model("Student", studentSchema);
