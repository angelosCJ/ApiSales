const mongoose = require("mongoose");

const storage = new mongoose.Schema({
    ItameName:{type:String,required:true},
    Cartons:{type:String,required:true},
    QuantityNumber:{type:String,required:true},
    Rprice:{type:String,required:true},
    CWprice:{type:String,required:true},
    CRprice:{type:String,required:true},
    StockPrice:{type:String,required:true},
    StockProfit:{type:String,required:true},
});

module.exports = mongoose.model("stokestorage",storage);
