const mongoose = require("mongoose");
const moment = require("moment");
const Student = require("./models/Student");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://labbiometrix:tJ38MjzxgLETVVOH@cluster0.glnatru.mongodb.net/Students_API?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Function to generate time entries for Mondays from 10am to 1pm within a date range
const generateTimeEntries = (startDate, endDate) => {
  const timeEntries = [];
  let currentDate = moment(startDate);
  const endDateMoment = moment(endDate);

  while (currentDate.isSameOrBefore(endDateMoment)) {
    // Check if the current date is a Monday
    if (currentDate.day() === 1) {
      // If it's Monday, generate a time entry for 10am to 1pm
      const timeIn = currentDate
        .clone()
        .set({ hour: 10, minute: 0, second: 0 });
      const timeOut = currentDate
        .clone()
        .set({ hour: 13, minute: 0, second: 0 });

      // Add the time entry to the array with room "Digital Lab"
      timeEntries.push({
        timeIn: timeIn.toDate(),
        timeOut: timeOut.toDate(),
        room: "Digital Lab", // Add room information here
      });
    }

    // Move to the next day
    currentDate = currentDate.add(1, "day");
  }

  return timeEntries;
};

// ID of the student you want to add time entries for
const studentId = "66120a0080f2b44c25967a46";

// Generate time entries for Mondays from March 11 to April 5
const timeEntries = generateTimeEntries("2024-03-11", "2024-04-05");

// Update the student document in the database
Student.findByIdAndUpdate(
  studentId,
  { $push: { timeEntries: { $each: timeEntries } } }, // Push the new time entries to the timeEntries array
  { new: true } // Return the updated document
)
  .then((updatedStudent) => {
    console.log("Time entries added successfully:", updatedStudent);
  })
  .catch((error) => {
    console.error("Error adding time entries:", error);
  });
