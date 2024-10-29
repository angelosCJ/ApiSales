const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
   date:{type:String,required:true},
   name:{type:String,required:true},
   quantity:{type:String,required:true},
   price:{type:String,required:true},
   total:{type:String,required:true}
});

module.exports = mongoose.model("salesdata",dataSchema);