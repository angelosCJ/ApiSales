const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
   date: { type: String, required: true },  // Changed to String to store formatted date
   name: { type: String, required: true },
   quantity: { type: Number, required: true },
   price: { type: Number, required: true },
   total: { type: Number, required: true },
   sale: { type: String, required: true }
   
});

module.exports = mongoose.model("SalesData", dataSchema);
