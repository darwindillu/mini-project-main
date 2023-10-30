

const mongoose = require('mongoose');
const productCollection=require('../model/productschema')
const mongoosePaginate = require('mongoose-paginate-v2');

const registerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }, 
    blocked: {
        type: Boolean,
        required: true,
        default: false
    }, 
    admin:{
       type:Boolean,
       default:false
    },
    superAdmin:{
        type:Boolean,
        default:false
    },
    cart: {
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            },
            productname: {
                type: String,
            },
            quantity: {
                type: Number,
                default: 1
            }, 
            stock:{
                type:Number
            },
            realPrice: {
                type: Number,
            },
            images:[{
               type:String,
            }],
            price: {
                type: Number,
            },
            grandtotal: {
                type: Number,
            },
        }]
    },
   

    walletbalance:{
        type: Number,
        default:0
    },
    
    wallethistory: [
        {   
            process:{
                type: String 
            },  
            amount: {
                type:Number
            },
            date: {
                type: Date,
                default: Date.now
            },
            productname:[{
                type:String
            }]
        }
    ],

    Address: [{
        address: {
            type: String,
        },
       
        city: {
            type: String,
        },

        district:{
            type: String,
        },
       
        mobile: {
            type: Number,
        },
        pincode: {
            type: Number,
        }
    }],

    coupons:[{
       code:{
        type:String
       },
       couponId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'coupon'
       }
    }],

    usedCoupons: [{
        code: {
          type: String,
        },
        couponId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'coupon',
        },
      }],
      
orders: [{
    razorpay_order_Payment_Id:{
        type:String
    },
    realPrice:{
        type:Number
    },
    address: {
        type:String
    },
    payment: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    productName: {
        type: String
    },
    quantity: {
        type: Number
    },
    
    status: {
        type: String,
        default: 'Pending'
    },
    productprice:{
        type:Number
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
    }
   }]
})

registerSchema.plugin(mongoosePaginate);
const registercollection = new mongoose.model("userregister", registerSchema);

module.exports = registercollection;