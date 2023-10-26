const mongoose = require('../database/dbConnect')

const categorySchema = new mongoose.Schema({

    description: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        required: true,
        unique: true,
    },
    availability: {
        type: String,
        default: "true"
    },
    discount:{
        type: Number,
        default:0
    }

})

const categoryCollection = new mongoose.model('category', categorySchema)

module.exports = categoryCollection