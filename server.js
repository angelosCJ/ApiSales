const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const auth = require("./auth");
const salesSchema = require("./schema");
const storageSchema = require("./store");

const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors({ origin: "*" }));  // Allow all origins


mongoose.connect("mongodb+srv://kadurienzo:ballsdeep%402025@mern.zylr0.mongodb.net/Sales?retryWrites=true&w=majority&appName=MERN").
then(()=> console.log("Connected to MongoDB")).
catch((error)=> console.log("Unable to connect to database",error));

const PORT = process.env.PORT || 3000 ;

app.listen(PORT,()=>{
    console.log("Server is Live and Running");
});

app.post("/register",async(req,res)=>{
   const {name,email,password} = req.body;
    try {
        const hashedPassword = await bcryptjs.hash(password,10);
        const newUser = new auth.schema({name,email,password:hashedPassword});
        await newUser.save();
        res.status(200).send("Succssesfuly registered a new user");
    } catch (error) {
        res.status(500).send("Unable to register user credentials",error);
    }
});

app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try {
        const USER_RECORD = await  auth.findOne({email:email});

        if (!USER_RECORD) {
            res.status(404).send("User name or email does not exist");
        }

      const IS_PASSWORD_VALID = await bcryptjs.compare(password,USER_RECORD.password);
      
      if (!IS_PASSWORD_VALID) {
        res.status(501).send("Invalid Password");
      }else{
        res.status(200).send("Succsseful login");
    }

    } catch (error) {
        res.status(404).send("User email and password not found");
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

app.post("/insertStorage",async(req,res)=>{
   const {ItemName,Cartons,QuantityNumber,Rprice,CWprice,CRprice,StockPrice,StockProfit} = req.body;
      try {
     const STORAGE_RECORDS = new storageSchema.schema({ ItemName, Cartons, QuantityNumber, Rprice, CWprice, CRprice, StockPrice, StockProfit });

        await STORAGE_RECORDS.save();
        res.status(201).send("Stock amount and records saved successfuly");
      } catch (error) {
        res.status(501).send("Unable to save storage stock data",error);
      }
});

app.get("/read",async(req,res)=>{
    try {
        const SALES_DATA = await salesSchema.find({});
        res.send(SALES_DATA);
    } catch (error) {
        res.status(501).send("Request Failed",error);
    }
});

app.get("/readStorage",async(req,res)=>{
    try {
        const STORAGE_DATA = await storageSchema.find({});
        res.send(STORAGE_DATA);
    } catch (error) {
        res.status(501).send("Response Failed, Unable to read Storage data",error);
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

  app.delete("/deleteStorage/:id",async(req,res)=>{
    const id = req.params.id;
    await storageSchema.findByIdAndDelete(id).exec();
    res.send("Stock storage data deleted");
  });
