const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const auth = require("./auth");
const salesSchema = require("./schema");

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://192.168.100.3:8081', 'http://192.168.100.3:8080','http://localhost:5173']
}));    
mongoose.connect("mongodb+srv://kadurienzo:ballsdeep%402025@mern.zylr0.mongodb.net/Sales?retryWrites=true&w=majority&appName=MERN").
then(()=> console.log("Connected to MongoDB")).
catch((error)=> console.log("Unable to connect to database",error));

const PORT = process.env.PORT || 8800;

app.listen(PORT,()=>{
    console.log("Server is Live and Running");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new auth({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ message: "Successfully registered a new user" });
  } catch (error) {
    res.status(500).json({ message: "Unable to register user", error: error.message });
  }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const USER_RECORD = await auth.findOne({ email: email });
        if (!USER_RECORD) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const IS_PASSWORD_VALID = await bcryptjs.compare(password, USER_RECORD.password);
        if (!IS_PASSWORD_VALID) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.status(200).json({ message: "Successfully logged in" });
    } catch (error) {
        console.error("Error during login:", error); // Log the exact error to debug
        res.status(500).json({ message: "Unable to log in", error: error.message });
    }
});

app.post("/insert", async (req, res) => {
  const formatDate = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year} ${hours}:${minutes}`; // Formatted as dd/mm/yyyy hh:mm
  };

  const { date, name, quantity, price, total, sale } = req.body;

  // Basic input validation
  if (!date || !name || !quantity || !price || !total || !sale) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const salesRecord = new salesSchema({
      date: formatDate(new Date(date)), // Format the date before storing
      name,
      quantity: parseFloat(quantity),     // Ensure quantity is a number
      price: parseFloat(price),           // Ensure price is a number
      total: parseFloat(total) ,           // Ensure total is a number
      sale
      
    });
    
    await salesRecord.save();
    res.status(200).json({ message: "Sales record saved successfully" });
  } catch (error) {
    console.error("Error saving sales record:", error); // Log error for debugging
    res.status(500).json({ message: "Unable to save data", error: error.message });
  }
});

app.get("/read", async (req, res) => {
    try {
        const salesData = await salesSchema.find({});
        res.status(200).json(salesData); // Send response with status 200 and the sales data in JSON format
    } catch (error) {
        console.error("Error reading sales data:", error); // Log the error for debugging
        res.status(500).json({ message: "Unable to read data", error: error.message }); // Use 500 for server errors
    }
});


app.put("/update",async(req,res)=>{
  const {id,updateDate,updateName,updateQuantity,updatePrice,updateTotal} = req.body;
  try {
    const updateSalesData = await salesSchema.findById(id);
    if(updateSalesData){
     updateSalesData.date = updateDate;
     updateSalesData.name = updateName;
     updateSalesData.quantity = updateQuantity;
     updateSalesData.price = updatePrice;
     updateSalesData.total = updateTotal;
     updateSalesData.sale = updateSale; 
     updateSalesData.save();
       res.status(201).json({ message: "Updated Successfully" });
    }
  } catch (error) {
      res.status(501).json({ message: "Unable to update data" });
  }
});

app.delete('/delete/:id',async (req,res)=>{
    const id = req.params.id;
    await salesSchema.findByIdAndDelete(id).exec();
    res.send("User Data Deleted");
  });
