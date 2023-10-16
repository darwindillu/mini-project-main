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
    }

})

const categoryCollection = new mongoose.model('category', categorySchema)

module.exports = categoryCollection