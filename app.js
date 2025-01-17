const express = require("express")
const collection = require("./mongo")
const cors = require("cors")
const bcrypt = require("bcryptjs");
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
    credentials: true,
}));
  

app.get("/",cors(),(req,res)=>{

})

app.post("/updateSession", async (req, res) => {
    const { email, workSeconds, breakSeconds } = req.body;
  
    try {
      await collection.updateOne(
        { email },
        {
          $inc: {
            totalSecondsWorked: workSeconds,
            totalSecondsBreak: breakSeconds,
          },
        }
      );
      res.status(200).json({ message: "Session updated successfully" });
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  app.post("/getSessionData", async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await collection.findOne({ email });
  
      if (user) {
        res.status(200).json({
          totalSecondsWorked: user.totalSecondsWorked || 0,
          totalSecondsBreak: user.totalSecondsBreak || 0,
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching session data:", error);
      res.status(500).json({ message: "Failed to fetch session data" });
    }
  });



  app.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await collection.findOne({ email });

        if (!user) {
            return res.json("notexist");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            res.json("exist");
        } else {
            res.json("wrongpassword");
        }
    } catch (error) {
        console.log(error);
        res.json("fail");
    }
});



app.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await collection.findOne({ email });

        if (userExists) {
            return res.json("exist");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await collection.insertMany({
            email,
            password: hashedPassword,
            todolist: [],
            totalSecondsWorked: 0,
            totalSecondsBreak: 0
        });

        return res.json("notexist");
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json("fail");
    }
});


app.post("/addTask", async (req, res) => {
    const { email, task } = req.body;
  
    try {
      const user = await collection.findOne({ email });
  
      if (user) {
        await collection.updateOne(
          { email },
          { $push: { todolist: task } } 
        );
        res.status(200).json({ message: "Task added successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error adding task:", error);
      res.status(500).json({ message: "Failed to add task" });
    }
  });

  app.post("/deleteTask", async (req, res) => {
    const { email, task } = req.body;
  
    try {
      const user = await collection.findOne({ email });
  
      if (user) {
        await collection.updateOne(
          { email },
          { $pull: { todolist: task } }
        );
        res.status(200).json({ message: "Task deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });
  
  
app.post("/getTasks", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await collection.findOne({ email });

    if (user) {
      res.status(200).json({ todolist: user.todolist || [] });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});



app.listen(8000, () => console.log("Server running on port 8000"));