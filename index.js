const express = require("express");
const mongoose = require("mongoose");
const app = express();
const studentRoutes = require("./routes/student");
const userRoutes = require("./routes/user");
const scheduler = require("./scheduler");
const cors = require("cors");
require("dotenv").config();

mongoose.connect("mongodb://127.0.0.1:27017/Students_API", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Now connected to MongoDB Atlas.");
  // Start the scheduler
  scheduler.timeoutStudents();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", studentRoutes);
app.use("/api/users", userRoutes);

if (require.main === module) {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`API is now online on port ${process.env.PORT || 5000}`)
  );
}

module.exports = app;
