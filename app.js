const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const userRouter = require('./routes/userRoutes')
const adminRouter = require('./routes/adminrouter')
const { default: mongoose } = require('mongoose');
const productCollection = require('./model/productschema')


app.use(express.json())
app.set('view engine', 'ejs')

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next()
})

app.use(session({
    secret: ['hjdhj', 'fhfhhfh', 'jeefhjej', 'ejjfejefj', 'efjefjjf', 'dhjcbuhrb', 'ncjieui', 'dchjbdhcb', 'djcdhcb', 'hfhrhrh', 'rfhrhjfr', 'rfjrjr'],
    saveUninitialized: false,
    resave: false
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter)
app.use('/user', userRouter)
app.use('/admin', adminRouter)

// 500 Error Page    

app.get('/500', (req, res) => {
    res.status(500).render('user/page500')
})

app.use((req,res)=>{
   res.render('404')
})

app.listen(3001, () => {
    console.log('Listening to http://shoppeee.shop:3001');
})
