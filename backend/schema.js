const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true }
});

module.exports = mongoose.model("Sales", salesSchema);
