const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const auth = require("./auth");
const salesSchema = require("./schema");

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://192.168.100.3:8081', 'http://192.168.100.3:8080']
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
    const USER_RECORD = await auth.findOne({ email: email.toLowerCase() });
    if (!USER_RECORD) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const IS_PASSWORD_VALID = await bcryptjs.compare(password, USER_RECORD.password);
    if (!IS_PASSWORD_VALID) {
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: "Successfully logged in" });
  } catch (error) {
    res.status(500).json({ message: "Unable to log in", error: error.message });
  }
});


app.post("/insert",async(req,res)=>{
    const {date,name,quantity,price,total} = req.body;
    try {
        const SALES_RECORDS = new salesSchema.schema({date,name,quantity,price,total});
        await SALES_RECORDS.save();
        res.status(201).send("Sales records saved successfuly");
    } catch (error) {
        res.status(501).send("Unable to save data",error);
    }
});

app.get("/read",async(req,res)=>{
    try {
        const SALES_DATA = await salesSchema.find({});
        res.send(SALES_DATA);
    } catch (error) {
        res.status(501).send("Request Failed");
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
     updateSalesData.save();
     res.status(201).send("Upadete Successful");
    }
  } catch (error) {
     res.status(501).send("Unable to update data",error);
  }
});

app.delete('/delete/:id',async (req,res)=>{
    const id = req.params.id;
    await salesSchema.findByIdAndDelete(id).exec();
    res.send("User Data Deleted");
  });
