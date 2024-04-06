const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  classes: [
    {
      subjectCode: String,
      subjectDescription: String,
      timeSlots: [
        {
          dayOfWeek: String,
          startTime: String,
          endTime: String,
          room: String,
        },
      ],
      year: String,
      section: String,
      enrolledStudents: [
        {
          studentNo: String,
          studentFirstName: String,
          studentMiddleName: String,
          studentLastName: String,
        },
      ], // Array of student numbers
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
