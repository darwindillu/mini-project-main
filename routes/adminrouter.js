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

const { userPage, homePage, block, unBlock, orderStatus, categoryPage, postAddCategory, addCategory, update, postUpdate, unlistCat, product, addProduct, postAddProduct, updateProduct, postUpdateProduct, deleteProduct, adminLogOut, makeAdmin, removeAdmin, adminPage, adminProfile, editProfile, postEdit, adminLogin, adminHome, deleteImage, getOrders } = require('../controllers/adminController');

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

module.exports = router