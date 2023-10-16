const { Number } = require('twilio/lib/twiml/VoiceResponse')
const mongoose = require('../database/dbConnect')

const productSchema = new mongoose.Schema({

    productname: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: true,
        }
    ],
    category: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        default: 'true'
    },
    reviews:[{
        review:{
            type:String
        },
        rating:{
            type:Number
        },
        username:{
            type:String
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user register'
        }
    }],
})

const productCollection = new mongoose.model('product', productSchema)

module.exports = productCollection