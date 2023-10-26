const registercollection = require('../model/registerSchema')

const isblocked = async (req, res, next) => {
    try {
        const email = req.session.user
        const userData = await registercollection.findOne({ email: email })
        if (userData.blocked === false) {
            next()
        } else {
            res.redirect('/user/logout')
        }
    } catch(error) {
        console.error(error)
        res.redirect('/500')
    }
}

module.exports = { isblocked }