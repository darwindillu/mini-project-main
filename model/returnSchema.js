const mongoose = require('../database/dbConnect')

const returnSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user register'
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user register'
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'
    },
    productName:{
        type:String
    },
    price:{
        type:Number
    },
    reason:{
        type:String
    },
    status:{
        type:String,
        default: 'Pending'
    }
})

const returnCollection = new mongoose.model("return", returnSchema);

module.exports = returnCollection;