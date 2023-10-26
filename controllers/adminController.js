const registercollection = require('../model/registerSchema')
const { default: mongoose } = require('mongoose');
const categoryCollection = require('../model/categoryschema')
const productCollection = require('../model/productschema')
const returnCollection = require('../model/returnSchema')
const couponCollection = require('../model/couponSchema')
const multer = require('multer')
const bcrypt = require('bcrypt');
const PDFDocument = require('pdfkit')


// Admin Login

const adminLogin = (req, res) => {
  try {
    const errorMessage = req.query.error
    const successMessage = req.query.success;

    if (req.session.admin) {
      res.redirect('/admin/home')
    } else {
      res.status(200).render('admin/login', { errorMessage, successMessage })
    }
  } catch {
    res.status(500).redirect('/500')
  }
};

// Admin Post login

const adminHome = async (req, res) => {
  try {
    const check = await registercollection.findOne({ email: req.body.email });
    req.session.data = check

    if (!check) {
      const errorMessage = 'Email Not Found';
      return res.redirect(`/admin/login?error=${encodeURIComponent(errorMessage)}`);
    }

    if (check.blocked == true) {
      const errorMessage = 'User Banned';
      return res.redirect(`/admin/login?error=${encodeURIComponent(errorMessage)}`);
    }

    const storedhash = check.password;
    const providedpass = req.body.password;

    bcrypt.compare(providedpass, storedhash, (err, result) => {
      if (err) {
        const errorMessage = 'Invalid Password'
        res.redirect(`/admin/login?error=${encodeURIComponent(errorMessage)}`)
      }

      if (result) {
        if (check.admin === true || check.superAdmin === true) {
          req.session.username = check.username;

          req.session.admin = req.body.email;
          return res.redirect('/admin/home');
        } else {
          const errorMessage = 'Not an Admin'
          res.redirect(`/admin/login?error=${encodeURIComponent(errorMessage)}`)
        }
      } else {
        const errorMessage = 'Admin not found';
        return res.redirect(`/admin/login?error=${encodeURIComponent(errorMessage)}`);
      }
    });
  } catch {
    res.status(500).redirect('/500');
  }
};

// Home Page

const homePage = async (req, res) => {
  try {
    if (req.session.admin) {
      const check = req.session.data
      const admin = check.superAdmin
      const username = req.session.username
      res.status(200).render('admin/home', { username, admin, dest: 'home' })
    } else {
      res.redirect('/admin/login')
    }
  } catch {
    res.status(500).redirect('/500')
  }
};

// Profile

const adminProfile = async (req, res) => {
  try {
    const data = await registercollection.find({ email: req.session.admin }, 'username email mobile')
    if (req.session.admin) {
      const successMessage = req.query.success
      res.render('admin/adminprofile', { data, successMessage })
    } else {
      res.redirect('/admin/login')
    }
  } catch {
    res.redirect('/500')
  }
}

// Edit profile

const editProfile = async (req, res) => {
  try {

    const profileid = req.params.profileid
    req.session.profileid = profileid
    const profile = await registercollection.findById(profileid)
    if (req.session.admin && profile) {
      res.render('admin/editprofile', { profile1: [profile] })
    } else {
      res.redirect('/admin/login')
    }
  } catch {
    res.redirect('/500')
  }
}

// Post Edit Profile

const postEdit = async (req, res) => {
  const profile = req.session.profileid
  try {
    const updateData = {
      username: req.body.username,
      email: req.body.email,
      mobile: req.body.email
    }
    await registercollection.updateOne({ _id: profile }, { $set: updateData });
    const successMessage = 'Edited Data Successfully'
    res.redirect(`/admin/adminprofile?success=${encodeURIComponent(successMessage)}`);
  } catch {
    res.status(500).redirect('/500');
  }
};

// User Page

const userPage = async (req, res) => {
  try {
    const data = await registercollection.find({}, 'username email mobile _id blocked admin superAdmin')
    if (req.session.admin) {
      const blocked = data.blocked
      const username = req.session.username
      const errorMessage = req.query.error
      const successMessage = req.query.success
      const admin1 = data.admin
      const admin = data.superAdmin
      res.status(200).render('admin/users', { data, username, blocked, successMessage, admin, admin1, errorMessage, dest: 'users' })
    } else {
      res.redirect('/admin/home')
    }
  } catch {
    res.status(500).redirect('/500')
  }
};

// Block User

const block = async (req, res) => {
  const userId = req.body.userId;
  try {
    const data = req.session.data
    if (data.superAdmin === true) {

      const user = await registercollection.findOneAndUpdate(
        { _id: userId },
        { $set: { blocked: true } },
        { new: true }
      );
      const successMessage = 'User Blocked Successfully'
      res.redirect(`/admin/user?success=${encodeURIComponent(successMessage)}`);
    } else {
      const errorMessage = 'Autherisation Denied'
      res.redirect(`/admin/user?error=${encodeURIComponent(errorMessage)}`)
    }
  } catch {
    res.status(500).redirect('/500');
  }
};

// Unblock User

const unBlock = async (req, res) => {
  const userId = req.body.userId;
  try {
    const data = req.session.data
    if (data.superAdmin == true) {

      const user = await registercollection.findOneAndUpdate(
        { _id: userId },
        { $set: { blocked: false } },
        { new: true }
      );
      const successMessage = "User unblocked successfully"
      res.redirect(`/admin/user?success=${encodeURIComponent(successMessage)}`);
    } else {
      const errorMessage = 'Autherisation Denied'
      res.redirect(`/admin/user?error=${encodeURIComponent(errorMessage)}`)
    }
  } catch {
    res.status(500).redirect('/500');
  }
};

// Make Admin

const makeAdmin = async (req, res) => {
  const userId = req.body.userId;
  const data = await registercollection.findOne({ _id: userId })
  try {
    const data1 = req.session.data
    if (data.blocked == false && data1.superAdmin == true) {

      const user = await registercollection.findOneAndUpdate(

        { _id: userId },
        { $set: { admin: true } },
        { new: true }
      );
      const successMessage = 'Admin Added Successfully'
      res.redirect(`/admin/user?success=${encodeURIComponent(successMessage)}`);
    } else {
      const errorMessage = 'User Already Blocked/Denied Authorisation'
      res.redirect(`/admin/user?error=${encodeURIComponent(errorMessage)}`)
    }
  } catch {
    res.status(500).redirect('/500');
  }
};

// Admins Page

const adminPage = async (req, res) => {
  try {
    const data = await registercollection.find({}, 'username email mobile _id blocked admin superAdmin')
    if (req.session.admin) {
      const blocked = data.blocked
      const admin = data.superAdmin
      const successMessage = req.query.success
      const errorMessage = req.query.error
      const admin1 = data.admin
      const username = req.session.username
      res.status(200).render('admin/admin', { data, username, blocked, successMessage, errorMessage, admin1, admin, dest: 'admins' })
    } else {
      res.redirect('/admin/home')
    }
  } catch {
    res.status(500).redirect('/500')
  }
};

// Remove Admin

const removeAdmin = async (req, res) => {
  const userId = req.body.userId;
  try {
    const data = req.session.data
    if (data.superAdmin == true) {

      const user = await registercollection.findOneAndUpdate(
        { _id: userId },
        { $set: { admin: false } },
        { new: true }
      );
      const successMessage = "Removed Admin successfully"
      res.redirect(`/admin/adminpage?success=${encodeURIComponent(successMessage)}`);
    } else {
      const errorMessage = 'User Already Blocked/Denied Authorisation'
      res.redirect(`/admin/adminpage?error=${encodeURIComponent(errorMessage)}`)
    }
  } catch {
    res.status(500).redirect('/500');
  }
};

// Category Page

const categoryPage = async (req, res) => {
  try {
    if (req.session.admin) {
      const username = req.session.username
      const check = req.session.data
      const admin = check.superAdmin
      const category = await categoryCollection.find({}, ' category description availability discount ')
      const successMessage = req.query.success

      res.status(500).render('admin/category', { username, category, successMessage, admin, dest: 'category' })
    } else {
      res.redirect('/admin/login')
    }
  } catch {
    res.status(500).redirect('/500')
  }
};

// Add Category Page

const addCategory = (req, res) => {
  try {
    if (req.session.admin) {

      const errorMessage = req.query.error
      res.status(500).render('admin/addcategory', { errorMessage })
    } else {
      res.redirect('/admin/login')
    }
  } catch {
    res.status(500).redirect('/500')
  }
};

// Post Add Category

const postAddCategory = async (req, res) => {
  try {
    const categoryname = req.body.categoryname;
    const check = await categoryCollection.find({ category: { $regex: (`^`) + categoryname, $options: 'i' } });

    if (check.length > 0) {
      const errorMessage = 'Category name should be unique';
      res.redirect(`/admin/addcategory?error=${encodeURIComponent(errorMessage)}`);
    } else {

      const categorydata = {
        category: req.body.categoryname,
        description: req.body.description,
      };

      await categoryCollection.create(categorydata);

      const successMessage = 'Category Added Successfully';
      res.redirect(`/admin/category?success=${encodeURIComponent(successMessage)}`);
    }
  } catch (error) {
    if (error.code === 11000) {
      const errorMessage = 'Category name is already taken';
      res.redirect(`/admin/addcategory?error=${encodeURIComponent(errorMessage)}`);
    } else {
      res.status(500).redirect('/500');
    }
  }
};


// Update Category

const update = async (req, res) => {
  try {
    const categoryid = req.params.catid;
    req.session.catid = categoryid
    const category = await categoryCollection.findById(categoryid);
    if (category && req.session.admin) {
      const errorMessage = req.query.error
      res.render('admin/updatecategory', { category, errorMessage })
    } else {
      res.redirect('/admin/login')
    }
  } catch {
    res.status(500).redirect('/500');
  }
};

// Post Update Category

const postUpdate = async (req, res) => {
  const catid = req.session.catid;
  try {
    const categoryname = req.body.categoryname;

    const existingCategory = await categoryCollection.findOne({ category: { $regex: (`^`) + categoryname, $options: 'i' } });

    if (existingCategory) {
      if (existingCategory._id.toString() !== catid) {
        const errorMessage = 'Category name should be unique';
        return res.redirect(`/admin/update/${catid}?error=${encodeURIComponent(errorMessage)}`);
      }
    }

    const category = req.body.categoryname;
    const categoryDiscount = parseInt(req.body.discount);

    const updateData = {
      category: req.body.categoryname,
      description: req.body.description,
      discount: parseInt(req.body.discount)
    };

    await categoryCollection.updateOne({ category: category }, { $set: updateData });

    const productData = await productCollection.find({ category: category });


    for (const product of productData) {
      const price = product.price;
      const discount = product.discount;
      const discount1 = categoryDiscount;
      const offer = discount + discount1;
      const offerPrice = Math.floor(price - (price * (offer / 100)));

      await productCollection.updateOne(
        { _id: product._id },
        { $set: { categoryOffer: discount1, offerPrice: offerPrice } }
      );
    }

    const successMessage = 'Category Updated Successfully';
    res.redirect(`/admin/category?success=${encodeURIComponent(successMessage)}`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).redirect('/500');
  }
};




// Unlist category

const unlistCat = async (req, res) => {
  const userId = req.body.userId;
  try {
    const data = req.session.data

    const user = await categoryCollection.findOneAndUpdate(
      { _id: userId },
      { $set: { availability: false } },
      { new: true }
    )
    const name = user.category

    if (user) {

      const product = await productCollection.updateMany(
        { category: name },
        { $set: { availability: false } },
        { new: true }
      );

      const successMessage = 'Category unlisted Successfully'
      res.redirect(`/admin/category?success=${encodeURIComponent(successMessage)}`);

    }
  } catch {
    res.status(500).redirect('/500');
  }
};


// Product Page

const product = async (req, res) => {
  try {
    if (req.session.admin) {
      const username = req.session.username
      const check = req.session.data
      const admin = check.superAdmin
      const productdata = await productCollection.find({}, ' productname stock price description category availability discount offerPrice')
      const successMessage = req.query.success
      res.render('admin/product', { username, productdata, successMessage, admin, dest: 'product' })
    } else {
      res.redirect('/admin/login')
    }
  } catch {
    res.status(500).redirect('/500')
  }
};

// Add product

const addProduct = (req, res) => {
  try {
    if (req.session.admin) {
      const errorMessage = req.query.error
      res.render('admin/addproduct', { errorMessage })
    } else {
      res.redirect('/admin/login')
    }
  } catch {
    res.status(500).redirect('/500')
  }
};

// Post Add Product

const postAddProduct = async (req, res) => {
  try {
    const check = await productCollection.findOne({ productname: req.body.productname });

    if (check && check.productname === req.body.productname) {
      const errorMessage = 'Name should be Unique';
      res.redirect(`/admin/addproduct?error=${encodeURIComponent(errorMessage)}`);
    } else {

      const productdata = {
        productname: req.body.productname,
        stock: req.body.stock,
        price: req.body.price,
        images: req.files.map(file => file.filename),
        description: req.body.description,
        discount: req.body.discount,
        category: req.body.category,
        offerPrice: (req.body.price) - (req.body.price * ((req.body.discount) / 100))
      };

      await productCollection.insertMany([productdata]);
      const successMessage = 'Product Added Successfully';
      res.redirect(`/admin/product?success=${encodeURIComponent(successMessage)}`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).redirect('/500');
  }
};


// Update Product

const updateProduct = async (req, res) => {
  try {
    const productid = req.params.productid;
    req.session.prodid = productid
    const product = await productCollection.findById(productid);
    if (product && req.session.admin) {
      res.status(200).render('admin/updateproduct', { product1: [product], product });
    } else {
      res.redirect('/admin/login')
    }
  } catch {
    res.status(500).redirect('/500');
  }
};

// Post Update Product

const postUpdateProduct = async (req, res) => {
  const productid = req.session.prodid
  try {
    const image1 = req.files.map(file => file.filename)
    const existingProducts = await productCollection.find({
      _id: productid,
      images: { $in: image1 },
    });
    if (existingProducts.length > 0) {
      const errorMessage = 'Same images already exist in the database';
      res.redirect(`/admin/updateproduct?error=${encodeURIComponent(errorMessage)}`);
    } else {
      const product = await productCollection.findById(productid)
      const discount1 = product.categoryOffer

      const updateData = {
        productname: req.body.productname,
        stock: req.body.stock,
        price: req.body.price,
        discount: req.body.discount,
        offerPrice: Math.floor(req.body.price - (req.body.price * ((req.body.discount + discount1) / 100))),
        description: req.body.description,
        categoryname: req.body.category
      }
      const image = {
        images: req.files.map(file => file.filename),

      }

      await productCollection.updateOne({ _id: productid }, { $set: updateData, $push: { images: { $each: [image.images[0]] } } });
      const successMessage = 'Product Updated Successfully'
      res.redirect(`/admin/product?success=${encodeURIComponent(successMessage)}`);
    }
  } catch {
    res.status(500).redirect('/500')
  }
};

// Delete image

const deleteImage = async (req, res) => {
  const productId = req.params.productId;
  const imageIndex = parseInt(req.params.imageIndex);

  try {
    const product = await productCollection.findById(productId);

    if (imageIndex >= 0 && imageIndex < product.images.length) {
      const deletedImage = product.images.splice(imageIndex, 1)[0];

      await product.save();

      const successMessage = 'Image deleted successfully';
      res.status(200).redirect(`/admin/product?success=${encodeURIComponent(successMessage)}`);
    } else {
      const errorMessage = 'Image Cannot find'
      res.status(400).redirect(`/admin/updateproduct?error=${encodeURIComponent(errorMessage)}`);
    }
  } catch {
    res.status(500).redirect('/500');
  }
};


// Delete Product

const deleteProduct = async (req, res) => {
  const userId = req.body.userId;
  try {
    const data = req.session.data

    const user = await productCollection.findOneAndUpdate(
      { _id: userId },
      { $set: { availability: false } },
      { new: true }
    );
    const successMessage = 'Product unlisted Successfully'
    res.redirect(`/admin/product?success=${encodeURIComponent(successMessage)}`);

  } catch {
    res.status(500).redirect('/500');
  }
};

// Coupon List

const couponPage = async (req, res) => {
  try {
    const admin = req.session.admin
    if (admin) {
      const username = req.session.username
      const coupon = await couponCollection.find()
      const errorMessage = req.query.error
      const successMessage = req.query.success
      res.render('admin/coupon', { admin, coupon, errorMessage, username, successMessage, dest: 'coupon' })
    } else {
      res.redirect('/admin/login')
    }

  } catch {
    res.redirect("/500")
  }
}

// Add coupons

const addCoupon = (req, res) => {
  try {
    if (req.session.admin) {
      const errorMessage = req.query.error
      res.render('admin/addcoupon', { errorMessage })
    } else {
      res.redirect('/admin/login')
    }
  } catch {
    res.status(500).redirect('/500')
  }
};

// Add coupons
const postAddCoupon = async (req, res) => {
  try {
    const check = await productCollection.findOne({ code: req.body.code });

    if (check && check.code === req.body.code) {
      const errorMessage = 'Code should be Unique';
      res.redirect(`/admin/addcoupon?error=${encodeURIComponent(errorMessage)}`);
    } else {

      const coupondata = {
        code: req.body.code,
        discount: req.body.discount,
        minValue: req.body.minValue,
        description: req.body.description,
      };

      await couponCollection.insertMany([coupondata]);
      const successMessage = 'Coupon Added Successfully';
      res.redirect(`/admin/couponPage?success=${encodeURIComponent(successMessage)}`);
    }
  } catch {
    res.status(500).redirect('/500');
  }
};

// Edit Coupon

const editCoupon = async (req, res) => {
  try {
    const couponid = req.params.couponid;
    req.session.couponid = couponid
    const coupon = await couponCollection.findById(couponid);
    if (coupon && req.session.admin) {
      const errorMessage = req.query.error
      res.status(200).render('admin/editCoupon', { coupon1: [coupon], coupon, errorMessage });
    } else {
      res.redirect('/admin/login')
    }

  } catch {
    res.redirect('/500')
  }
}

// Delete coupon

const deleteCoupon = async (req, res) => {
  try {
    const couponId = req.body.userId
    const coupon = await couponCollection.findOneAndUpdate(
      { _id: couponId },
      { $set: { availability: false } },
      { new: true }
    );
    const successMessage = 'coupon deleted Successfully'
    res.redirect(`/admin/couponPage?success=${encodeURIComponent(successMessage)}`);
  } catch {
    res.redirect('/500')
  }
}


// orderlist 

const getOrders = async (req, res) => {
  try {
    const username = req.session.username;
    const check = req.session.data;
    const admin = check.admin;

    const page = parseInt(req.query.page) || 1;
    const productsPerPage = 10;

    const orders = await registercollection
      .aggregate([
        {
          $unwind: "$orders"
        },
        {
          $project: {
            _id: "$orders._id",
            productName: "$orders.productName",
            userId: "$orders.userId",
            date: "$orders.date",
            quantity: "$orders.quantity",
            realPrice: "$orders.realPrice",
            payment: "$orders.payment",
            status: "$orders.status"
          }
        },
        {
          $sort: { date: -1 }
        },
        {
          $skip: (page - 1) * productsPerPage
        },
        {
          $limit: productsPerPage
        }
      ]);

    const totalOrdersAggregate = await registercollection.aggregate([
      {
        $unwind: "$orders"
      },
      {
        $group: {
          _id: null,
          totalCount: { $sum: 1 }
        }
      }
    ]);

    const totalOrders = totalOrdersAggregate[0].totalCount;

    const totalPages = Math.ceil(totalOrders / productsPerPage);

    if (req.session.admin) {
      res.render('admin/orderlist', {
        orders,
        username,
        admin,
        dest: 'order',
        totalPages,
        currentPage: page
      });
    } else {
      res.redirect('/admin/login');
    }
  } catch {
    res.status(500).redirect('/500')
  }
};



// status update

const orderStatus = async (req, res) => {
  const { orderid, status } = req.body;

  try {
    const updatedUser = await registercollection.findOneAndUpdate(
      { 'orders._id': orderid },
      { $set: { 'orders.$.status': status } },
      { new: true }
    );

    res.status(200).json({ message: 'Status updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Return page

const adminReturn = async (req, res) => {
  try {
    const username = req.session.username;
    const admin = req.session.admin

    const returnData = await returnCollection.find({})

    if (admin) {
      res.render('admin/adminReturn', {
        returnData,
        username,
        admin,
        dest: 'return'
      });
    } else {
      res.redirect('/admin/login');
    }
  } catch {
    res.redirect('/500')
  }
};

// Return Order

const adminPostReturn = async (req, res) => {

  const user = req.session.user
  const { returnid, status, price, userId, proId, orderId } = req.body;

  try {
    const updated = await returnCollection.findOneAndUpdate(
      { _id: returnid },
      { $set: { 'status': status } },
      { new: true }
    );

    if (status == 'Approve') {

      const userData = await registercollection.findById(userId)
      let walletBalance = userData.walletbalance

      walletBalance = walletBalance + price

      await registercollection.findOneAndUpdate(
        { _id: userId },
        { $set: { walletbalance: walletBalance } },
        { new: true }
      )

      const wallethistory = {
        process: 'Return',
        amount: price,
        productname: 'Successfully Added Return Amount',
      };

      await registercollection.findOneAndUpdate(
        { _id: userId },
        { $push: { wallethistory: wallethistory } },
        { new: true }

      )

      await registercollection.findOneAndUpdate(
        { email: user, 'orders._id': orderId },
        { $set: { 'orders.$.status': 'Approved' } }
      );
    }
    if (status == 'Reject') {

      await registercollection.findOneAndUpdate(
        { email: user, 'orders._id': orderId },
        { $set: { 'orders.$.status': 'Return Request Rejected' } }
      );
    }

    res.status(200).json({ message: 'Status updated successfully', updated });
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// sales report

const sales = async (req, res) => {
  try {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const pipeline = [
      {
        $unwind: '$orders'
      },
      {
        $project: {
          month: { $month: '$orders.date' }
        }
      },
      {
        $group: {
          _id: '$month',
          ordersCount: { $sum: 1 }
        }
      }
    ];

    const ordersByMonth = await registercollection.aggregate(pipeline).exec();

    const monthlyOrderCounts = ordersByMonth.map(monthData => ({
      month: monthNames[monthData._id - 1],
      ordersCount: monthData.ordersCount
    }));

    res.json(monthlyOrderCounts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Revenue

const revenue = async (req, res) => {
  try {
    const aggregateResult = await productCollection.aggregate([
      {
        $group: {
          _id: '$category',
          totalStock: { $sum: '$stock' }
        }
      },
      {
        $project: {
          _id: 0,
          categories: "$_id",
          totalStocks: "$totalStock"
        }
      }
    ]);

    res.json(aggregateResult);
  } catch (error) {
    throw new Error('Error calculating total stock: ' + error.message);
  }
};

// yearly sale

const saleyearly = async (req, res) => {
  let ordersByYear;
  let orderCountsArray = Array(8).fill(0);

  const pipeline = [
    {
      $unwind: '$orders'
    },
    {
      $project: {
        year: { $year: '$orders.date' }
      }
    },
    {
      $group: {
        _id: { year: '$year' },
        ordersCount: { $sum: 1 }
      }
    }
  ];

  try {
    const result = await registercollection.aggregate(pipeline);

    result.forEach(data => {
      const yearIndex = data._id.year - 2023;
      orderCountsArray[yearIndex] = {
        year: data._id.year,
        ordersCount: data.ordersCount
      };
    });

    res.status(200).json(orderCountsArray);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Report page

const reportPage = async (req, res) => {
  try {
    const username = req.session.username;
    const admin = req.session.admin

    if (admin) {
      res.render('admin/adminReports', { username, admin, dest: 'reports' })
    } else {
      res.redirect('/admin/login')
    }
  } catch {
    res.redirect('/500')
  }
}

// sales month pdf

const monthlyPdfReport = async (req, res) => {
  const { selectedDate } = req.body;

  if (!selectedDate) {
    return res.status(400).json({ error: 'Selected date is required.' });
  }

  const selectedMonth = new Date(selectedDate).getMonth();

  const matchCondition = selectedMonth === 9 ?
    { $or: [{ orderMonth: 9 }, { orderMonth: 10 }] } :
    { orderMonth: selectedMonth };

  const pipeline = [
    {
      $unwind: '$orders'
    },
    {
      $addFields: {
        orderMonth: { $month: '$orders.date' }
      }
    },
    {
      $match: matchCondition
    }
  ];

  try {
    const result = await registercollection.aggregate(pipeline)
    if (result == '') {
      return;
    }

    const doc = new PDFDocument();
    const fileName = `sales_report_${selectedDate}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    doc.pipe(res);

    doc.fontSize(16).text('Sales Report', { align: 'center' });

    result.forEach(order => {
      const productName = order.orders.productName;
      const quantity = order.orders.quantity;
      const totalprice = order.orders.realPrice;

      doc.font('Helvetica').fontSize(12).text(`Product: ${productName}, Quantity: ${quantity}, Total Price: ${totalprice}`);
    });

    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// sale year pdf

const yearlyPdfReport = async (req, res) => {
  const { selectedDate } = req.body;

  if (!selectedDate) {
    return res.status(400).json({ error: 'Selected date is required.' });
  }

  const selectedYear = new Date(selectedDate).getFullYear();

  const pipeline = [
    {
      $unwind: '$orders'
    },
    {
      $addFields: {
        orderYear: { $year: '$orders.date' }
      }
    },
    {
      $match: { orderYear: selectedYear }
    }
  ];

  try {
    const result = await registercollection.aggregate(pipeline);

    if (result.length === 0) {
      return res.status(404).json({ error: 'No orders found for the selected year.' });
    }

    const doc = new PDFDocument();
    const fileName = `sales_report_${selectedYear}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

    doc.pipe(res);

    doc.fontSize(16).text(`Sales Report for ${selectedYear}`, { align: 'center' });

    result.forEach(order => {
      const productName = order.orders.productName;
      const quantity = order.orders.quantity;
      const totalprice = order.orders.realPrice;

      doc.font('Helvetica').fontSize(12).text(`Product: ${productName}, Quantity: ${quantity}, Total Price: ${totalprice}`);
    });

    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



// Log Out

const adminLogOut = (req, res) => {
  try {
    if (req.session.admin) {
      req.session.admin = null;
      const successMessage = 'Logged Out Successfully'
      res.redirect(`/admin/login?success=${encodeURIComponent(successMessage)}`)
    }
  } catch { res.status(500).redirect('/500') }
}


module.exports = { userPage, reportPage, deleteCoupon, monthlyPdfReport, yearlyPdfReport, sales, saleyearly, revenue, editCoupon, addCoupon, postAddCoupon, couponPage, adminReturn, adminPostReturn, getOrders, orderStatus, homePage, block, unBlock, categoryPage, postAddCategory, addCategory, update, postUpdate, unlistCat, product, addProduct, postAddProduct, updateProduct, postUpdateProduct, deleteProduct, adminLogOut, makeAdmin, removeAdmin, adminPage, adminProfile, editProfile, postEdit, adminHome, adminLogin, deleteImage }