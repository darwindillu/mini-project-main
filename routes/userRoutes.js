const express = require('express')
const router = express.Router()
const path = require('path')

const { login, wallet, editReview, topUpDone, deleteReview, postEditReview, updatePass, postReview, review, editPassword, updatePasss, categoryPage, editProfile, register, saveAddress, orderSuccess, successPage, newRegister, filter, getCheckOut, loginRegister, userHome, otp, reset, shop, logOut, productDetail, mainHome, searchProducts, resetPass, resetConfirmOtp, getResetOtp, getCart, addToCart, removeProduct, cartQuantityUpdate, userProfile, myOrders, pagenationOrders, cancelOrder, razorpayOrder, paymentDone, walletPayment, myInvoice, topUp } = require('../controllers/userController')
const isblock = require('../middleweare/isUser')

router.get('/', mainHome)
router.get('/login', login)
router.get('/register', register)
router.post('/register', newRegister)
router.post('/login', loginRegister)
router.post('/userhome', userHome)
router.get('/otp', otp)
router.get('/reset', reset)
router.post('/reset', resetPass)
router.get('/resetotp', getResetOtp)
router.post('/passotp', resetConfirmOtp)
router.get('/logout', logOut)
router.get('/productdetail/:id', productDetail)
router.get('/shop', shop)
router.get('/cart', isblock.isblocked, getCart)
router.get('/addtocart/:productId', isblock.isblocked, addToCart)
router.post('/search', searchProducts)
router.post('/remove/:proid', isblock.isblocked, removeProduct)
router.post('/cart/quantityUpdate/:itemId', isblock.isblocked, cartQuantityUpdate)
router.post('/filter', isblock.isblocked, filter)
router.get('/checkout', isblock.isblocked, getCheckOut)
router.post('/save', isblock.isblocked, saveAddress)
router.get('/successpage', isblock.isblocked, successPage)
router.post('/success', isblock.isblocked, orderSuccess)
router.get('/reset2', updatePasss)
router.post('/reset2', updatePass)
router.get('/category/:catId', isblock.isblocked, categoryPage)
router.get('/profile/:userId', isblock.isblocked, userProfile)
router.post('/editprofile/:userId', isblock.isblocked, editProfile)
router.post('/editpassword', editPassword)
router.get('/orders', isblock.isblocked, myOrders)
router.get('/orderspage', isblock.isblocked, pagenationOrders)
router.get('/cancelorder/:id', isblock.isblocked, cancelOrder)
router.post('/payorder', isblock.isblocked, razorpayOrder)
router.post('/paymentdone', paymentDone)
router.post('/wallet', isblock.isblocked, walletPayment)
router.get('/myInvoice/:id', myInvoice)
router.get('/review/:id', review)
router.post('/review/:id', postReview)
router.get('/user/wallet', isblock.isblocked, wallet)
router.get('/editReview/:rid/:id', editReview)
router.post('/editReview/:id/:rid', postEditReview)
router.get('/deleteReview/:id/:rid', deleteReview)
router.post('/topup', topUp)
router.post('/topupdone', topUpDone)

module.exports = router