const mongoose  = require('../database/dbConnect')


const couponSchema=new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    minValue: {
        type: Number,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    availability:{
        type:Boolean,
        default:true
    }
})

const couponCollection=new mongoose.model('coupon',couponSchema)

module.exports=couponCollection