const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // `unique: true` creates an index
  password: { type: String, required: true }
});

module.exports = mongoose.model("UserNames",userSchema);
