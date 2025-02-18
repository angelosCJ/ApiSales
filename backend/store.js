const mongoose = require("mongoose");

const storageSchema = new mongoose.Schema({
    ItemName: { type: String, required: true }, // Corrected field name
    Cartons: { type: Number, required: true }, 
    QuantityNumber: { type: Number, required: true }, 
    Rprice: { type: Number, required: true }, 
    CWprice: { type: Number, required: true }, 
    CRprice: { type: Number, required: true }, 
    StockPrice: { type: Number, required: true }, 
    StockProfit: { type: Number, required: true }
});

module.exports = mongoose.model("Storage", storageSchema); // Changed model name to a singular noun
