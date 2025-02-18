const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const auth = require("./auth");
const Sales = require("./schema"); // Make sure this is the correct path to your Sales model
const router = express.Router();
const Storage = require("./store");

const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors({ origin: "*" })); 

mongoose.connect("mongodb+srv://kadurienzo:ballsdeep%402025@mern.zylr0.mongodb.net/Sales?retryWrites=true&w=majority&appName=MERN")
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log("Unable to connect to database", error));

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
  console.log("Server is Live and Running");
});

// Register route handlers
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
    console.error("Error during login:", error);
    res.status(500).json({ message: "Unable to log in", error: error.message });
  }
});

app.post("/insert", async (req, res) => {
  const { date, name, quantity, price, total } = req.body;

  if (!date || !name || !quantity || !price || !total ) {
    console.log("Validation failed:", { date, name, quantity, price, total });
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const salesRecord = new Sales({
      date: new Date(date),
      name,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      total: parseFloat(total)
    });

    await salesRecord.save();
    res.status(200).json({ message: "Sales record saved successfully" });
  } catch (error) {
    console.error("Error saving sales record:", error);
    res.status(500).json({ message: "Unable to save data", error: error.message });
  }
});

app.post("/insertStorage", async (req, res) => {
   const { ItemName, Cartons, QuantityNumber, Rprice, CWprice, CRprice, StockPrice, StockProfit } = req.body;
   try {
      const STORAGE_RECORDS = new Storage({ // Removed .schema
          ItemName, 
          Cartons, 
          QuantityNumber, 
          Rprice, 
          CWprice, 
          CRprice, 
          StockPrice, 
          StockProfit 
      });
      await STORAGE_RECORDS.save();
      res.status(201).send("Stock amount and records saved successfully");
   } catch (error) {
      console.error("Storage Insert Error:", error);
      res.status(500).send("Unable to save storage stock data");
   }
});


app.get("/read", async (req, res) => {
  try {
    const salesData = await Sales.find({});
    res.status(200).json(salesData);
  } catch (error) {
    console.error("Error reading sales data:", error);
    res.status(500).json({ message: "Unable to read data", error: error.message });
  }
});

app.get("/readStorage", async (req, res) => {
    try {
        const STORAGE_DATA = await Storage.find({});
        res.json(STORAGE_DATA);
    } catch (error) {
        res.status(500).json({ message: "Unable to read storage data", error });
    }
});


// Sum of all 'sale' values
app.get("/sales/sum", async (req, res) => {
  try {
    const result = await Sales.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$total" },
        },
      },
    ]);
    const totalSales = result.length > 0 ? result[0].totalSales : 0;
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/update", async (req, res) => {
  const { id, updateDate, updateName, updateQuantity, updatePrice, updateTotal } = req.body;
  try {
    const updateSalesData = await Sales.findById(id);
    if (updateSalesData) {
      updateSalesData.date = updateDate;
      updateSalesData.name = updateName;
      updateSalesData.quantity = updateQuantity;
      updateSalesData.price = updatePrice;
      updateSalesData.total = updateTotal;
      await updateSalesData.save();
      res.status(201).json({ message: "Updated Successfully" });
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Unable to update data", error: error.message });
  }
});

app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await Sales.findByIdAndDelete(id);
    res.status(200).json({ message: "Sales record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete data", error: error.message });
  }
});
