const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/Mini_Project')
    .then(() => {
        console.log('mongodb connected');
    })
    .catch(() => {
        console.log('connection failed');
    })

module.exports = mongoose