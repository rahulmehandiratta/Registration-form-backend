const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connection to MongoDB
mongoose.connect(
  "mongodb url",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
console.log("connected to mongodb database successfully");

//schema have all the required fields we need
const employeeSchema = new mongoose.Schema({
  name: String,
  number: Number,
  email: String,
  id: String,
  address: String,
  designation: String,
  joiningDate: Date,
  gender: String,
  experiences: [
    {
      companyName: String,
      designation: String,
      timePeriod: String,
    },
  ],
});

const Employee = mongoose.model("Employee", employeeSchema);

app.get("/getuser", async (req, res) => {
  userList = await Employee.find();
  if (userList.lenght == 0) {
    return res.status(404);
  }
  res.status(200).json(userList);
});




app.delete("/userdelete/:id", async (req, res) => {
  const resourceId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(resourceId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    // Find the resource by its ID and delete it
    const deletedResource = await Employee.findByIdAndDelete(resourceId);

    if (!deletedResource) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.status(200).json({ message: "Employee details deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});



app.put("/userupdate/:id", async (req, res) => {
  const resourceId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(resourceId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    // Find the resource by its ID and delete it
    const deletedResource = await Employee.findByIdAndUpdate(resourceId, req.body);

    if (!deletedResource) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});



// Route for posting the information collected into the mongodb database
app.post("/registers", async (req, res) => {
  try {
    const {
      name,
      number,
      email,
      id,
      address,
      designation,
      joiningDate,
      gender,
      experiences,
    } = req.body;

    console.log(req.body);
    //below code will create a new document or user we can say in database
    const data = new Employee({
      name,
      number,
      email,
      id,
      address,
      designation,
      joiningDate,
      gender,
      experiences,
    });

    //below code will save the information into the database and if there is some error found then it will show error message
    await data.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed." });
  }
});

//server will run at the porn we give at the top of the code named const port : --
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
