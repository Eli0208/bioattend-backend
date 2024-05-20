const moment = require("moment-timezone");
const cron = require("node-cron");
const Student = require("./models/Student");
const User = require("./models/User");

const timeoutStudents = async () => {
  try {
    const currentTime = moment.tz("Asia/Manila");

    // Get all users (teachers) to fetch their classes and time slots
    const users = await User.find();

    for (const user of users) {
      for (const userClass of user.classes) {
        // Extract student numbers from userClass.enrolledStudents
        const enrolledStudentNos = userClass.enrolledStudents.map(
          (student) => student.studentNo
        );

        for (const timeSlot of userClass.timeSlots) {
          const endTime = moment.tz(
            `${currentTime.format("YYYY-MM-DD")} ${timeSlot.endTime}`,
            "Asia/Manila"
          );
          const timeoutThreshold = endTime.add(5, "minutes");

          if (currentTime.isAfter(timeoutThreshold)) {
            // Find enrolled students with incomplete time entries in the specified room
            const students = await Student.find({
              studentNo: { $in: enrolledStudentNos },
              timeEntries: {
                $elemMatch: {
                  room: timeSlot.room,
                  timeOut: { $exists: false },
                },
              },
            });

            for (const student of students) {
              for (const entry of student.timeEntries) {
                if (
                  !entry.timeOut &&
                  entry.room === timeSlot.room &&
                  moment(entry.timeIn).isBefore(timeoutThreshold)
                ) {
                  entry.timeOut = currentTime.toDate();
                  await student.save();
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error while timing out students:", error);
  }
};

// Schedule the task to run every minute
cron.schedule("* * * * *", timeoutStudents);

module.exports = {
  timeoutStudents,
};
