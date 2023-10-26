const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')


const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './public/img');
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

const { userPage,adminPostReturn,sales,saleyearly,revenue, homePage, block, unBlock, orderStatus, categoryPage, postAddCategory, addCategory, update, postUpdate, unlistCat, product, addProduct, postAddProduct, updateProduct, postUpdateProduct, deleteProduct, adminLogOut, makeAdmin, removeAdmin, adminPage, adminProfile, editProfile, postEdit, adminLogin, adminHome, deleteImage, getOrders, adminReturn, couponPage, addCoupon, postAddCoupon, editCoupon, deleteCoupon, reportPage, monthlyPdfReport, yearlyPdfReport } = require('../controllers/adminController');

router.get('/login', adminLogin)
router.post('/home', adminHome)
router.get('/home', homePage)
router.get('/user', userPage)
router.post('/block', block)
router.post('/unblock', unBlock)
router.get('/category', categoryPage)
router.get('/addcategory', addCategory)
router.post('/addcategory', postAddCategory)
router.get('/update/:catid', update)
router.post('/update', postUpdate)
router.post('/delete', unlistCat)
router.get('/product', product)
router.get('/addproduct', addProduct)
router.post('/addproduct', upload.array('image'), postAddProduct)
router.get('/updateproduct/:productid', updateProduct)
router.post('/updateproduct', upload.array('image'), postUpdateProduct)
router.post('/deleteproduct', deleteProduct)
router.get('/adminlogout', adminLogOut)
router.post('/makeadmin', makeAdmin)
router.post('/removeadmin', removeAdmin)
router.get('/adminpage', adminPage)
router.get('/adminprofile', adminProfile)
router.get('/editprofile/:profileid', editProfile)
router.post('/posteditprofile', postEdit)
router.post('/deleteimage/:productId/:imageIndex', deleteImage)
router.get('/getorder', getOrders)
router.post('/orderstatus', orderStatus)
router.get('/adminReturn',adminReturn)
router.post('/adminPostReturn',adminPostReturn)
router.get('/couponPage',couponPage)
router.get('/addCoupon',addCoupon)
router.post('/postAddCoupon',postAddCoupon)
router.get('/editCoupon/:couponid',editCoupon)
router.post('/deleteCoupon',deleteCoupon)
router.post('/sales-data',sales)
router.post('/revenue',revenue)
router.post('/saleyearly',saleyearly)
router.get('/reports',reportPage)
router.post('/month-pdf-report',monthlyPdfReport)
router.post('/yearsalepdfreport',yearlyPdfReport)

module.exports = router