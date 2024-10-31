const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
   date: { type: Date, required: true },
   name: { type: String, required: true },
   quantity: { type: Number, required: true },
   price: { type: Number, required: true },
   total: { type: Number, required: true }
});

module.exports = mongoose.model("SalesData", dataSchema);
