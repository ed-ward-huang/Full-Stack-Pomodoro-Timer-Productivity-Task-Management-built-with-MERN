const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Pomodoro")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(() => {
    console.log("Failed to connect to MongoDB");
  });

const newSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  totalSecondsWorked: {
    type: Number,
    default: 0, 
  },
  totalSecondsBreak: {
    type: Number,
    default: 0, 
  },
  todolist: {
    type: [String],  
    default: [],
  },
});

const collection = mongoose.model("collection", newSchema);

module.exports = collection;
