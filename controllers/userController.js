const productCollection = require('../model/productschema');
const registercollection = require('../model/registerSchema')
const categoryCollection = require('../model/categoryschema')
const returnCollection = require('../model/returnSchema')
const couponCollection = require('../model/couponSchema')
const nodemailer = require('nodemailer')
const generateOtp = require('generate-otp')
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb');
const easyinvoice = require('easyinvoice')
const Razorpay = require('razorpay')
const razorpay = new Razorpay({
  key_id: "rzp_test_YarKazF62a98gp",
  key_secret: 'LZsyQX8qt0flglYddpVr2Krx'
})

const bcrypt = require('bcrypt');
const { product } = require('./adminController');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ddillu777@gmail.com',
    pass: 'qpsu fccf iaia oeer'
  },
});

// First Page

const mainHome = async (req, res) => {
  try {
    const productdata = await productCollection.find({}, 'images productname price availability offerPrice discount categoryOffer').limit(20);
    const productdata1 = await productCollection.find().skip(20).limit(4)
    const username = req.session.username1;
    const user = req.session.user;
    const userdata = await registercollection.findOne({ email: user })

    const userId = req.session.userId
    const errorMessage = req.query.error;
    const successMessage = req.query.success

    if (req.session.user && userdata.blocked === false) {
      res.render('user/userhome', { username, user, productdata, errorMessage, successMessage, productdata1, userId });
    } else {
      res.status(200).render('user/userhome', { username, user, productdata, errorMessage, successMessage, productdata1, userId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).redirect('/500');
  }
};

// Search Products

const searchProducts = async (req, res) => {
  try {
    const user = req.session.user;
    const username = req.session.username1;
    const name = req.body.name.trim();

    const product = await productCollection.find({
      productname: { $regex: new RegExp(name, 'i') }
    });
    const categorydata = await categoryCollection.find({})

    if (product && product.length > 0) {
      res.render('user/search', { productdata: product, user, username, categorydata });
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    res.redirect('/500');
  }
};



// SignUp Page

const register = (req, res) => {
  try {
    const errorMessage = req.query.error
    res.status(200).render('user/signup', { errorMessage })
  } catch {
    res.status(500).redirect('/500')
  }
};

// Post SignUp

const newRegister = async (req, res) => {
  try {
    const check = await registercollection.findOne({ email: req.body.email })
    if (check !== null && check.email === req.body.email) {
      const errorMessage = 'Email already registered'
      res.status(200).redirect(`/user/register?error=${encodeURIComponent(errorMessage)}`)
    } else {
      const email = req.body.email
      const data = {
        username: req.body.username,
        email: req.body.email,
        mobile: req.body.mobile,
        password: await bcrypt.hash(req.body.password, 10)
      }
      req.session.data = data
      req.session.trueregister = true
      const flag = req.session.trueregister

      if (flag) {
        const otp = generateOtp.generate(6, { digits: true, alphabets: false, specialChars: false });
        req.session.registerotp = otp

        const mailOptions = {
          from: 'ddillu777@gmail.com',
          to: `${email}`,
          subject: 'Your OTP Code',
          text: `Your OTP code is: ${otp}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error sending email: ' + error);
          } else {
            console.log('Email sent: ' + info.response);
            setTimeout(() => {
              req.session.registerotp = null
              req.session.trueregister = false
            }, 60000);

            setTimeout(() => {
              req.session.newpasswordotp = null
            }, 60000);
          }
          res.redirect('/user/otp')
        });

      }
      else {
        res.redirect('/user/getotp')
      }

    }
  } catch {
    res.status(500).redirect('/500')
  }
};

// Get OTP

const otp = (req, res) => {
  try {
    const errorMessage = req.query.error
    res.status(200).render('user/otp', { errorMessage })
  } catch {
    res.status(500).redirect('/500')
  }
};

// Post OTP

const loginRegister = async (req, res) => {
  const registerotp = req.session.registerotp
  const otp = req.body.otp

  if (otp == registerotp) {
    const data = req.session.data
    const successMessage = 'Successfully Registered'
    await registercollection.insertMany([data])
    res.redirect(`/user/login?success=${encodeURIComponent(successMessage)}`)
  }
  else {
    const errorMessage = 'Invalid OTP'
    res.redirect(`/user/otp?error=${encodeURIComponent(errorMessage)}`)
  }
}

// Login Page

const login = (req, res) => {
  try {
    const errorMessage = req.query.error
    const successMessage = req.query.success;
    if (req.session.user) {
      res.redirect('/')
    } else {
      res.status(200).render('user/login', { errorMessage, successMessage })
    }
  } catch {
    res.status(500).redirect('/500')
  }
};

// Get Reset Password

const reset = (req, res) => {
  try {
    const errorMessage = req.query.error
    res.status(200).render('user/resetpass', { errorMessage })
  } catch {
    res.status(500).redirect('/500')
  }
};

// Get resset otp

const getResetOtp = (req, res) => {
  const errorMessage = req.query.error
  res.render('user/passwordotp', { errorMessage })
}

// Post confirm Password

const resetPass = async (req, res) => {
  try {
    const check = await registercollection.findOne({ email: req.body.email });

    if (!check) {
      const errorMessage = 'Email is not registered';
      return res.redirect(`/user/reset?error=${encodeURIComponent(errorMessage)}`);
    }

    req.session.email1 = check.email;


    const email1 = req.session.email1;
    req.session.flags = true;
    const flag = req.session.flags;

    if (flag) {
      const otp = generateOtp.generate(6, { digits: true, alphabets: false, specialChars: false });
      req.session.registerotp1 = otp;

      const mailOptions = {
        from: 'ddillu777@gmail.com',
        to: `ddillu777@gmail.com`,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email: ' + error);
        } else {
          console.log('Email sent: ' + info.response);
          setTimeout(() => {
            req.session.registerotp1 = null;
            req.session.flags = false;
          }, 60000);

          setTimeout(() => {
            req.session.newpasswordotp = null;
          }, 60000);
        }
        res.redirect('/user/resetotp');
      });
    }
  }
  catch (error) {
    console.error(error);
    res.redirect('/500');
  }
};


// post confirm Password otp


const resetConfirmOtp = async (req, res) => {
  const registerotp = req.session.registerotp1
  const otp = req.body.otp

  if (otp == registerotp) {
    res.redirect('/user/reset2')
  }
  else {
    const errorMessage = 'Invalid OTP'
    res.redirect(`/user/resetotp?error=${encodeURIComponent(errorMessage)}`)
  }
}

// get password2

const updatePasss = async (req, res) => {
  const email1 = req.session.email1
  const errorMessage = req.query.error
  res.render('user/resetpass2', { errorMessage, email1 })
}


// update password

const updatePass = async (req, res) => {
  try {

    const password1 = req.body.password;
    const password2 = req.body.passwordconfirm;
    req.session.password = password1;

    if (password2 !== password1 || password1 == '' || password2 == '') {
      const errorMessage = 'Password mismatch'
      res.redirect(`/user/reset2?error=${encodeURIComponent(errorMessage)}`);

    }
    else {
      const email = req.session.email1
      const password1 = req.session.password;
      const password2 = await bcrypt.hash(password1, 10)
      const successMessage = 'Successfully Changed Password'
      await registercollection.updateOne({ email: email }, { $set: { password: password2 } })
      res.redirect(`/user/login?success=${encodeURIComponent(successMessage)}`)
    }
  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}

// Post Login

const userHome = async (req, res) => {
  try {
    const check = await registercollection.findOne({ email: req.body.email });
    req.session.data = check

    if (!check) {
      const errorMessage = 'User Not Found';
      return res.redirect(`/user/login?error=${encodeURIComponent(errorMessage)}`);
    }

    if (check.blocked === true) {
      const errorMessage = 'User Banned';
      return res.redirect(`/user/login?error=${encodeURIComponent(errorMessage)}`);
    }

    const storedhash = check.password;
    const providedpass = req.body.password;

    bcrypt.compare(providedpass, storedhash, (err, result) => {
      if (result == false) {
        const errorMessage = 'Invalid Password'
        res.redirect(`/user/login?error=${encodeURIComponent(errorMessage)}`)
      }

      else if (result === true) {
        if (check.admin === false && check.superAdmin === false) {
          req.session.username1 = check.username;
          req.session.userId = check._id

          req.session.user = req.body.email;
          return res.redirect('/');
        }

        else {
          const errorMessage = 'Invalid User';
          return res.redirect(`/user/login?error=${encodeURIComponent(errorMessage)}`);
        }
      }
    })
  }
  catch (error) {
    console.error(error);
    res.status(500).redirect('/500');
  }
};

// Profile page

const userProfile = async (req, res) => {
  try {
    const userId = req.params.userId
    const userdata = await registercollection.findById(userId)
    if (userdata.blocked === false) {
      const successMessage = req.query.success

      res.render('user/profile', { userdata, successMessage })
    } else {
      res.redirect('/user/logout')
    }

  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}

// edit profile

const editProfile = async (req, res) => {
  try {
    const userId = req.params.userId
    const userdata = await registercollection.findById(userId)
    const email = userdata.email
    const updateData = {
      username: req.body.username,
      mobile: req.body.mobile

    }
    await registercollection.updateOne({ email: email }, { $set: updateData })
    const successMessage = 'Profile Edited successfully'
    res.redirect(`/user/profile/${userId}?success=${encodeURIComponent(successMessage)}`)
  } catch (error) {
    consolele.error(error)
    res.redirect('/500')
  }
}

// edit profile password

const editPassword = async (req, res) => {
  try {
    const userId = req.body.userId;
    const check = await registercollection.findById(userId);
    const storedhash = check.password;
    const knownPassword = req.body.oldpassword;

    bcrypt.compare(knownPassword, storedhash, async (err, result) => {
      if (err) {
        res.status(500).json({ message: 'Internal server error' });
      } else if (!result) {
        res.status(400).json({ message: 'Password is incorrect' });
      } else {
        const newpassword = req.body.newpassword;

        if (newpassword === '') {
          res.status(400).json({ message: 'Password cannot be empty' })
        } else if (newpassword.length < 6) {
          res.status(400).json({ message: 'Should have more than 5 letters' })
        } else if (newpassword == knownPassword) {
          res.status(400).json({ message: 'Password Cannot be same' })
        } else {

          const password = await bcrypt.hash(newpassword, 10);

          await registercollection.updateOne({ _id: userId }, { $set: { password: password } });

          res.status(200).json({ message: 'Password changed successfully' });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// wallet

const wallet = async (req, res) => {
  try {
    const user = req.session.user
    const userdata = await registercollection.findOne({ email: user })
    const walletbalance = userdata.walletbalance
    const userId = req.session.userId
    const userData = await registercollection.findOne({ email: user }, { wallethistory: 1 })
    const wallet = userData.wallethistory.reverse()

    res.render('user/wallet', { walletbalance, userId, wallet })

  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}

// TopUp Wallet

const topUp = async (req, res) => {
  try {
    const email1 = req.session.user
    const name = await registercollection.findOne({ email: email1 })
    const amount = req.body.amountValue
    req.session.amount = amount
    const email = name.email
    const username = name.username
    const mobile = name.mobile

    let options = {
      amount: amount * 100,
      currency: 'INR',

    };

    razorpay.orders.create(options, function (err, order) {
      if (err) {
        console.error('Razorpay order creation error:', err);
        res.status(500).json({ error: 'Failed to create Razorpay order' });
      } else if (!order) {
        console.error('Razorpay order is null');
        res.status(500).json({ error: 'Razorpay order is null' });
      } else {
        res.json({ order, email, username, mobile });
      }
    });

  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}

// top up done

const topUpDone = async (req, res) => {
  const amount1 = parseInt(req.session.amount);
  const user = req.session.user;
  const { razorpay_payment_id } = req.body;

  const paymentDocument = await razorpay.payments.fetch(razorpay_payment_id);

  if (paymentDocument.status === 'captured') {
    try {
      const userdata = await registercollection.findOne({ email: user });
      let walletBalance = userdata.walletbalance;

      walletBalance += amount1;
      const wallet = await registercollection.findOneAndUpdate(
        { email: user },
        { $set: { walletbalance: walletBalance } },
        { new: true }
      );

      const wallethistory = {
        process: 'TopUp',
        amount: amount1,
        productname: 'Successfully Added Wallet Balance',
      };

      await registercollection.findOneAndUpdate(
        { email: user },
        { $push: { wallethistory: wallethistory } }
      );

      res.redirect(`/user/wallet`);
    } catch (error) {
      console.error(error);
      res.redirect('/500');
    }
  }
};


// order details

const myOrders = async (req, res) => {
  const email = req.session.user;

  try {
    const pagenum = 0;
    const a = 5 * pagenum;
    const b = 5 * (pagenum + 1)

    const email = req.session.user;
    const user = await registercollection.findOne({ email: email });
    const orderId = req.query.orderId
    const proId = req.query.proId

    const productsForFirstOrder = user.orders
    productsForFirstOrder.sort((a, b) => b.date - a.date);

    const length = productsForFirstOrder.length
    const pages = Math.ceil(length / 5)
    const userId = req.session.userId

    const limitedOrdersWithProducts = productsForFirstOrder.slice(a, b);

    limitedOrdersWithProducts.forEach(order => {
      order.date = order.date.toDateString(); 
    });

    res.render('user/order', { orders: limitedOrdersWithProducts, pagenum, pages, user, userId, orderId, proId });
  }
  catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).redirect('/500')
  }

};

// pagination order

const pagenationOrders = async (req, res) => {
  try {
    const pagenum1 = req.query.page;
    const pagenum = parseInt(pagenum1);
    const a = 5 * pagenum;
    const b = 5 * (pagenum + 1)

    const email = req.session.user;
    const userdata = await registercollection.findOne({ email: email });

    const productsForFirstOrder = userdata.orders

    const length = productsForFirstOrder.length
    const pages = Math.ceil(length / 5)
    const user = req.session.user
    const userId = req.session.userId

    const limitedOrdersWithProducts = productsForFirstOrder.slice(a, b);

    res.render('user/order', { orders: limitedOrdersWithProducts, pagenum, pages, user, userId });


  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).redirect('/500');
  }
};

// cancel order

const cancelOrder = async (req, res) => {
  const orderId = req.params.id;
  const email = req.session.user;
  const status = 'Cancelled';

  try {
    const userdata = await registercollection.findOne(
      {
        email: email,
        'orders._id': orderId
      },
      { 'orders.$': 1, walletbalance: 1 }
    );


    if (userdata && userdata.orders.length > 0) {
      const orders = userdata.orders;
      let total = 0;
      let payment = '';

      for (const order of orders) {
        payment = order.payment;
        total += order.productprice;
        productname = order.productName
      }
      let walletBalance = userdata.walletbalance;


      if (!isNaN(total)) {
        total = parseFloat(total);
      }

      if (!isNaN(walletBalance)) {
        walletBalance = parseFloat(walletBalance);
        walletBalance += total;
      }

      if (payment === 'wallet' || payment === 'Online') {


        const walletHistory = {
          process: 'Refund',
          amount: total,
          productname: productname

        }

        const updatedUser = await registercollection.findOneAndUpdate(
          { email: email, 'orders._id': orderId },
          {
            $set: {
              'orders.$.status': status,
              walletbalance: walletBalance
            },
            $push: { wallethistory: walletHistory },

          },
          {
            new: true,
          }
        );

        if (updatedUser) {
          res.redirect('/user/orders');
        } else {
          res.redirect('/user/orders');
        }
      } else {
        await registercollection.findOneAndUpdate(
          { email: email, 'orders._id': orderId },
          { $set: { 'orders.$.status': status } },
          { new: true }
        );
        res.redirect('/user/orders');
      }
    }
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Return Order

const returnProduct = async (req, res) => {
  try {

    const orderId = req.params.orderId
    const productName = req.params.productName
    const user = req.session.user
    const productData = await productCollection.findOne({ productname: productName })
    const proId = productData._id

    if (!user) {
      res.redirect('/user/login')
    } else {
      res.render('user/return', { orderId, proId })
    }
  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}

// Post Return

const postReturn = async (req, res) => {
  try {

    const orderId = req.params.orderId
    const proId = req.params.proId
    const productData = await productCollection.findById({ _id: proId })
    const productName = productData.productname
    const user = req.session.user
    const userData = await registercollection.findOne(
      { email: user },
      { _id: 1, orders: { $elemMatch: { _id: orderId } } }
    );
    const reason = req.body.return
    const userId = userData._id
    const orderData = userData.orders[0]
    const total = orderData.realPrice

    const updateData = {
      userId: userId,
      orderId: orderId,
      productId: proId,
      productName: productName,
      price: total,
      reason: reason
    }

    await registercollection.findOneAndUpdate(
      { email: user, 'orders._id': orderId },
      { $set: { 'orders.$.status': 'Return Requested' } }
    );

    await returnCollection.insertMany([updateData])

    res.redirect('/user/orderS')
  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}

// Cancel return

const cancelReturn = async (req, res) => {
  try {
    const orderId = req.params.orderId
    const productName = req.params.productName
    const productData = await productCollection.findOne({ productname: productName })

    const proId = productData._id

    const user = req.session.user
    const userData = await registercollection.findOne({ email: user })
    const reason = req.body.return
    const userId = userData._id

    await returnCollection.findOneAndUpdate(
      { userId: userId, orderId: orderId, productId: proId },
      { $set: { status: 'Rejected' } }
    );

    await registercollection.findOneAndUpdate(
      { email: user, 'orders._id': orderId },
      { $set: { 'orders.$.status': 'Return Request Rejected' } }
    );

    res.redirect('/user/orders')
  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}



// download invoice

const myInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;
    const email = req.session.user;

    const userdata = await registercollection.findOne({ email: email, });

    if (!userdata) {
      return res.status(404).json({ message: 'User not found' });
    }

    const order = userdata.orders.find((order) => order._id.equals(new ObjectId(orderId)));
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const address1 = order.address
    const address2 = userdata.Address.find((address2) => address2._id.equals(new ObjectId(address1)));

    const username = userdata.username;
    const address = address2.address;
    const pincode = address2.pincode;
    const city = address2.city;
    const district = address2.district;
    const productName = order.productName;
    const quantity = order.quantity;
    const total = order.realPrice
    const price = order.productprice


    let data = {

      "currency": "INR",
      "taxNotation": "",
      "marginTop": 25,
      "marginRight": 25,
      "marginLeft": 25,
      "marginBottom": 25,
      "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
      "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
      "sender": {
        "company": "ShoppeE",
        "address": "ShoppeE",
        "zip": "690548",
        "city": "Trivandrum",
        "country": "India"

      },
      "client": {
        "company": username,
        "address": address,
        "zip": pincode,
        "city": city,
        "country": "India"

      },
      "information": {
        "number": "2021.0001",
        "date": "21-10-2023",
        "due-date": "31-10-2023"
      },
      "products": [
        {
          "product Name": productName,
          "quantity": quantity,
          "description": productName,
          "tax-rate": 0,
          "price": price,
          "Shipping": 40
        },

      ],
      "bottomNotice": "Your invoice for the product",

    };
    res.json(data)

  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}




// Shop page

const shop = async (req, res) => {
  try {
    const userDetails = await registercollection.findOne({ email: req.session.user });
    let cartCount, cart;

    if (userDetails) {
      cart = userDetails.cart;
      cartCount = cart.items.length;
    }
    const userdata = await registercollection.findOne({ email: req.session.user })
    const categorydata = await categoryCollection.find({ availability: true });

    // Pagination logic

    const productsPerPage = 8;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * productsPerPage;

    const totalProducts = await productCollection.countDocuments({ availability: true });

    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const products = await productCollection
      .find({ availability: true })
      .skip(skip)
      .limit(productsPerPage);

    const username = req.session.username1
    const userId = req.session.userId


    res.render('user/shop', {
      title: 'ShoppeE',
      message: '',
      products,
      categorydata,
      user: req.session.user,
      cartCount,
      userId,
      totalPages,
      currentPage: page,
      username,
    });


  } catch (error) {
    console.error(error);
    res.status(500).redirect('/500');
  }
};

// Filter and Sort

const filter = async (req, res) => {
  try {
    const username = req.session.username1;
    const cat_name = req.body.category;
    const sortFilter = req.body.sortOption;
    const priceRange = req.body.price_range;
    const userId = req.session.userId;

    let sortDirection = 1;
    if (sortFilter === 'HeighToLow') {
      sortDirection = -1;
    }

    const categorydata = await categoryCollection.find({ availability: true });
    let products;

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-');
      products = await productCollection
        .find({ category: cat_name, availability: true, price: { $gte: +minPrice, $lte: +maxPrice } })
        .sort({ price: sortDirection });
    } else {
      products = await productCollection.find({ category: cat_name, availability: true }).sort({ price: sortDirection });
    }

    res.render('user/shop', { products, categorydata, user: req.session.user, sortFilter, cat_name, username, userId });
  } catch (error) {
    console.error(error.message);
    res.redirect('/500');
  }
};


// get category page

const categoryPage = async (req, res) => {
  try {
    const category1 = req.params.catId;
    const userId = req.session.userId
    const username = req.session.username1;
    const categorydata1 = await categoryCollection.findOne({ _id: category1 });
    const categorydata = await categoryCollection.find()
    const category = categorydata1.category;
    const productdata = await productCollection.find({ category: category });
    res.render('user/category', { productdata, user: req.session.user, username, categorydata, userId });
  } catch (error) {
    console.error(error);
    res.redirect('/500');
  }
};

// Product Detail Page

const productDetail = async (req, res) => {
  try {
    const username = req.session.username1
    const user = req.session.user
    const productid1 = req.params.id
    const productdata1 = await productCollection.findById({ _id: productid1 })
    const id = productdata1._id
    const reviews = productdata1.reviews
    const ratings = reviews.map((reviews) => reviews.rating);
    const successMessage = req.query.success
    const errorMessage = req.query.error

    const totalRatings = ratings.reduce((sum, rating) => sum + rating, 0);
    const averageRating = (totalRatings / reviews.length).toFixed(1);
    const review = productdata1.reviews.slice(0, 5)

    res.render('user/productdetail', { user, productdata2: [productdata1], username, id, review, averageRating, successMessage, errorMessage })

  } catch (error) {
    console.error(error)
    res.status(500).redirect('/500')
  }
};

// Review

const review = async (req, res) => {
  if (req.session.user) {
    const id = req.params.id
    res.render('user/review', { id })
  } else {
    res.redirect('/user/login')
  }
}

// post review

const postReview = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.session.user;
    const userdata = await registercollection.findOne({ email: user });
    const username1 = userdata.username;
    const userid = userdata._id;
    const productData = await productCollection.findById({ _id: id });

    const existingReview = productData.reviews.find((review) => review.userId.equals(userid));

    if (existingReview) {
      const errorMessage = 'You Already Added a Review';
      res.redirect(`/user/productdetail/${id}?error=${encodeURIComponent(errorMessage)}`);
    } else {
      const updateData = {
        review: req.body.review,
        rating: req.body.rating,
        username: username1,
        userId: userid,
      };
      await productCollection.findOneAndUpdate({ _id: id }, { $push: { reviews: updateData } });
      const successMessage = 'Review Added Successfully';
      res.redirect(`/user/productdetail/${id}?success=${encodeURIComponent(successMessage)}`);
    }
  } catch (error) {
    console.error(error);
    res.redirect('/500');
  }
};


// edit Review

const editReview = async (req, res) => {
  const id = req.params.id;
  const rid = req.params.rid;
  const user = req.session.user;

  if (!user) {
    res.redirect('/user/login');
    return;
  }

  const userdata = await registercollection.findOne({ email: user });
  const userid = userdata._id;

  try {
    const product = await productCollection.findOne(
      { _id: id },
      {
        reviews: { $elemMatch: { _id: rid, userId: userid } }
      });

    if (product && product.reviews.length > 0) {
      const review = product.reviews[0].review;
      res.render('user/editreview', { id, rid, review });
    } else {
      const errorMessage = 'You cannot Edit this'
      res.redirect(`/user/productdetail/${id}?error=${encodeURIComponent(errorMessage)}`);
    }
  } catch (error) {
    console.error(error);
    res.redirect('/500');
  }
};



// Post edit Review

const postEditReview = async (req, res) => {
  try {
    const id = req.params.id
    const rid = req.params.rid
    const username = req.session.username1
    const userdata = await registercollection.findOne({ username: username })
    const userid = userdata._id

    const updateData = {
      rating: req.body.rating,
      review: req.body.review,
      username: username,
      userId: userid
    }

    const productdata = await productCollection.findOneAndUpdate(
      { _id: id, 'reviews._id': rid },
      { $set: { 'reviews.$': updateData } },
      { new: true }
    )

    const successMessage = 'Review Edited Successfully'

    res.redirect(`/user/productdetail/${id}?success=${encodeURIComponent(successMessage)}`)
  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}

// Delete review

const deleteReview = async (req, res) => {

  const user = req.session.user
  const id = req.params.id;
  const rid = req.params.rid;
  if (!user) {
    res.redirect('/user/login')
  }

  const userdata = await registercollection.findOne({ email: user })
  const userid = userdata._id

  try {

    const productData = await productCollection.findOne(
      { _id: rid },
      { reviews: { $elemMatch: { _id: id, userId: userid } } }
    )

    if (productData && productData.reviews.length > 0) {
      const updatedProduct = await productCollection.findOneAndUpdate(
        { _id: rid },
        {
          $pull: {
            reviews: { _id: id }
          }
        },
        { new: true }
      );

      const successMessage = 'Review Deleted Successfully'
      res.redirect(`/user/productdetail/${rid}?success=${encodeURIComponent(successMessage)}`);
    } else {
      const errorMessage = 'You Cannot delete this'
      res.redirect(`/user/productdetail/${rid}/?error=${encodeURIComponent(errorMessage)}`)
    }
  } catch (error) {
    console.error(error);
    res.redirect('/500');
  }
};


// Add to cart

const addToCart = async (req, res) => {
  try {
    if (req.session.user) {
      const proid = req.params.productId
      const check = await productCollection.findById(proid)
      if (check) {
        const email1 = req.session.user
        let quantity = 1
        await registercollection.findOneAndUpdate(
          { email: email1, 'cart.items.productId': { $ne: proid } },
          {
            $push: {
              'cart.items': {
                productId: proid,
                productname: check.productname,
                images: check.images,
                quantity: 1,
                realPrice: check.offerPrice,
                price: quantity * check.offerPrice,
                offer: 'null'
              }
            }
          }
        );
        const successMessage = 'Product added successfully'
        res.redirect(`/user/cart?success=${encodeURIComponent(successMessage)}`)
      } else {
        res.redirect('/')
      }
    } else {
      res.redirect('/user/login')
    }
  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}

// cart page

const getCart = async (req, res) => {
  try {
    if (req.session.user) {
      const userId = req.session.userId
      const username = req.session.username1
      const userEmail = req.session.user;
      const userDetails = await registercollection.findOne({ email: userEmail })
      const name = userDetails.productname
      const similarproducts = await productCollection.find({ availability: true }).sort({ name: -1 }).limit(4)
      const cartItems = userDetails.cart.items
      const cartCount = cartItems.length
      const cartProductIds = cartItems.map(item => item.productId);
      const cartProducts = await productCollection.find({ _id: { $in: cartProductIds } });
      const productsPrice = cartItems.reduce((accu, element) => accu + (element.quantity * element.realPrice), 0);
      const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
      let totalPrice = 0;
      for (const item of cartItems) {
        const product = cartProducts.find(prod => prod._id.toString() === item.productId.toString());
        if (product) {
          totalPrice += item.quantity * product.offerPrice;
        }
      }
      const user = true
      res.render('user/cart', { message: "Login Page", user, username, name, userId, cartCount, cartItems, cartProducts, productsPrice, totalQuantity, totalPrice, similarproducts })
    } else {
      res.redirect('/login')
    }
  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }

}

// Remove Cart product

const removeProduct = async (req, res) => {
  try {

    const email1 = req.session.user;
    const id = req.params.proid

    const result = await registercollection.findOneAndUpdate(
      { email: email1 },
      {
        $pull: {
          'cart.items': { _id: id }
        }
      }
    );

    res.redirect('/user/cart')
  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}

// cart Quantity

const cartQuantityUpdate = async (req, res) => {
  try {
    const cartId = req.params.itemId;
    const data = req.body.quantity;
    const userEmail = req.session.user;
    const userDetails = await registercollection.findOne({ email: userEmail });

    const cartItems = userDetails.cart.items;

    const cartItem = cartItems.find((item) => item._id.toString() === cartId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    const regularPrice = cartItem.realPrice;
    let productId = cartItem.productId;

    const productData = await productCollection.findById(productId)
    let stockQuantity = productData.stock

    if (data > stockQuantity) {
      return res.status(400).json({ error: ' stock not available' });
    }

    cartItem.price = regularPrice * data;
    cartItem.quantity = data;

    const GPrice = cartItems.reduce((accu, element) => accu + element.price, 0);
    const T = cartItems.reduce((accu, element) => accu + element.price, 0);
    userDetails.grantTotal = GPrice;
    userDetails.total = T;


    await userDetails.save();

    const grantTotal = userDetails.grantTotal;
    const total = userDetails.total;

    res.json({ cartPrice: cartItem.price, grantTotal, total });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the quantity.' });
  }
};


// Checkout page

const getCheckOut = async (req, res) => {
  try {

    if (req.session.user) {
      const user = req.session.user
      const userId = req.session.userId
      const username = req.session.username1
      const categorydata = await categoryCollection.find()
      const userdata = await registercollection.findOne({ email: user })
      const cartItems = userdata.cart.items
      const total = cartItems.reduce((accu, element) => accu + element.price, 0);
      const productprice = cartItems.map(item => item.realPrice)
      const address = userdata.Address
      const coupons = await couponCollection.find()

      res.render('user/checkout', { username, user, categorydata, cartItems, total, userId, address, productprice, coupons })
    } else {
      res.redirect('/')
    }
  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}

// save address

const saveAddress = async (req, res) => {
  try {
    if (req.session.user) {
      const user = req.session.user
      const updatedata = {
        address: req.body.address,
        city: req.body.city,
        district: req.body.district,
        mobile: req.body.mobile,
        pincode: req.body.pincode
      }
      await registercollection.findOneAndUpdate({ email: user }, { $push: { Address: updatedata } })
      res.redirect('/user/checkout')
    } else {
      res.redirect('/')
    }
  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}

// Edit address

const editAddress = async (req, res) => {
  try {

    const id = req.params.id
    const user = req.session.user
    const userDocument = await registercollection.findOne({ email: user, 'Address._id': id });
    const Address = userDocument.Address

    res.status(200).render('user/editAddress', { Address })
  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}

// Post Edit Address

const postEditAddress = async (req, res) => {
  try {

    const addressId = req.params.id;
    const user1 = req.session.user;

    const update = {
      address: req.body.address,
      city: req.body.city,
      district: req.body.district,
      pincode: req.body.pincode,
      mobile: req.body.mobile,
    };

    const user = await registercollection.findOne({ email: user1 });

    const addressToUpdate = user.Address.id(addressId);

    if (addressToUpdate) {
      addressToUpdate.set(update);

      await user.save();

      res.redirect('/user/checkout')
    }

  } catch (error) {
    console.error(error)
    res.redirect('/500')
  }
}

// Coupen Verify

const verifyCoupon = async (req, res) => {
  try {
    const { coupenValue, grandtotalValue } = req.body;

    const coupon = await couponCollection.findOne({ code: coupenValue });
    if (!coupon) {
      return res.status(400).json({ message: 'Invalid Coupon' });
    }

    const minValue = coupon.minValue;
    const couponId = coupon._id;
    const discount = coupon.discount;

    const total = parseFloat(grandtotalValue);

    const newTotal = Math.floor((discount / 100) * total);
    const total2 = Math.floor(total - newTotal);

    if (total < minValue) {
      return res.status(400).json({ message: 'Minimum amount is needed', minValue });
    }

    const couponExisting = await registercollection.findOne({
      email: req.session.user,
      'usedCoupons.code': coupenValue,
    });

    if (couponExisting) {
      return res.status(400).json({ message: 'Coupon Already Used' });
    }

    await registercollection.updateOne(
      { email: req.session.user },
      {
        $push: {
          usedCoupons: { code: coupenValue, couponId: couponId },
        },
      }
    );

    return res.status(200).json({
      message: 'Coupon Applied',
      data: {
        couponId: couponId,
        discount: discount,
        minValue: minValue,
        newTotal: newTotal,
        total2: total2,
      },
    });

  } catch (error) {
    console.error(error);
    return res.status(500).redirect('/500');
  }
};

// clear coupon

const clearCoupen = async (req, res) => {
  const coupenid = req.body.coupenid
  const email = req.session.user
  await registercollection.updateOne(
    { email: email },
    { $pull: { coupons: { couponId: coupenid } } }
  );

  await registercollection.updateOne(
    { email: email },
    { $pull: { usedCoupons: { couponId: coupenid } } }
  );

  req.session.coupon = null
  res.status(200).json({ message: 'removed' })
}


// // success page

const successPage = async (req, res) => {
  const user = req.session.user
  const userdetails = await registercollection.findOne({ email: user })
  if (req.session.user && userdetails.blocked === false) {

    res.render('user/ordersuccess')
  } else {
    res.redirect('/user/logout')
  }
}

// Place order

const orderSuccess = async (req, res) => {
  try {
    const user = req.session.user;
    const userdata = await registercollection.findOne({ email: user });
    const userid = userdata._id;
    const { selectedAddress, paymentMethod } = req.body.data;
    const grandtotalValue = req.body.grandtotalValue;
    const data1 = req.body.data1;

    const productOrders = data1.map(product => ({
      productName: product.productName,
      quantity: product.quantity,
      productprice: product.price,
      images: product.images,
      realPrice: product.quantity * product.price,
      address: selectedAddress,
      payment: paymentMethod,
      userId: userid,
    }));

    for (const product of productOrders) {
      const { quantity, productName } = product;

      const existingProduct = await productCollection.findOne({ productname: productName });

      if (!existingProduct) {
        continue;
      }

      const currentStock = existingProduct.stock;
      const newStock = currentStock - quantity;

      if (existingProduct.stock != 0 && quantity <= existingProduct.stock) {
        await productCollection.updateOne(
          { productname: productName },
          { $set: { stock: newStock } }
        );
      }
      else {
        res.status(400).json({ message: "Out Of Stock" });
        return
      }
    }
    const x = await registercollection.updateOne(
      { email: user },
      { $push: { orders: productOrders } }
    );

    const updatedUser = await registercollection.findOneAndUpdate(
      { email: user },
      { $set: { 'cart.items': [] } },
      { new: true }
    );

    const updatedUser1 = await registercollection.findOneAndUpdate(
      { email: user },
      { $unset: { 'cart.grandtotal': 0 } },
      { new: true }
    );



    res.status(200).json({ message: 'logined', type: 'success' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// online payment

const razorpayOrder = async (req, res) => {
  try {
    const email = req.session.user;
    const name = await registercollection.findOne({ email: email }, { _id: 0, username: 1 });

    let totalamount = parseInt(req.body.totalamount);
    const productData = req.body.productData;

    for (const product of productData) {
      const { quantity, productName, productId } = product;
      const existingProduct = await productCollection.findById(productId);

      const currentStock = existingProduct.stock;

      if (quantity > currentStock) {
        res.status(400).json({ message: "Out Of Stock" });
        return
      } else {


        const options = {
          amount: totalamount * 100,
          currency: 'INR',
        };

        razorpay.orders.create(options, function (err, order) {
          if (err) {
            res.status(500).json({ error: 'Razorpay order creation failed' });
          } else {
            res.status(200).json({ order, name });
          }

        });
      }
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// payment done

const paymentDone = async (req, res) => {
  const user = req.session.user;
  const { razorpay_payment_id } = req.body;

  const paymentDocument = await razorpay.payments.fetch(razorpay_payment_id);

  if (paymentDocument.status === 'captured') {
    try {
      const address = JSON.parse(req.query.selectedAddress);
      const grandtotal = req.query.grandtotal;
      const productData = JSON.parse(req.query.productData);
      const userdata = await registercollection.findOne({ email: user })
      const userid = userdata._id

      const payment = 'Online';

      const productOrders = [];

      for (const item of productData) {
        const productName = item.productName;
        const quantity = item.quantity;
        const price1 = item.price

        const productOrder = {
          razorpay_order_Payment_Id: razorpay_payment_id,
          productName: productName,
          productprice: price1,
          realPrice: quantity * price1,
          quantity: quantity,
          address: address,
          payment: payment,
          userId: userid
        };

        productOrders.push(productOrder);
      }

      for (const product of productData) {
        const { quantity, productName } = product;

        const existingProduct = await productCollection.findOne({ productname: productName });

        if (!existingProduct) {
          continue;
        }

        const currentStock = existingProduct.stock;
        const newStock = currentStock - quantity;

        if (existingProduct.stock != 0 && quantity <= existingProduct.stock) {
          await productCollection.updateOne(
            { productname: productName },
            { $set: { stock: newStock } }
          );
        }
      }

      await registercollection.updateOne(
        { email: user },
        { $push: { orders: { $each: productOrders } } }
      );

      await registercollection.updateOne(
        { email: user },
        { $set: { 'cart.items': [], 'cart.grandtotal': 0 } }
      );

      res.redirect('/user/successpage');
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.send('Payment failed');
  }
};

// wallet payment

const walletPayment = async (req, res) => {
  try {

    const user = req.session.user;
    const selectedAddress = req.body.selectedAddress;
    const grandtotal = req.body.grandtotalValue;
    const payment = 'wallet';
    const data1 = req.body.productData;
    const productName = data1.map((product) => product.productName)

    const userdata = await registercollection.findOne({ email: user });
    const userid = userdata._id

    let walletBalance = userdata.walletbalance;

    if (walletBalance < grandtotal) {

      return res.json({ message: 'insufficient wallet balance' });

    } else {
      const productOrders = data1.map((product) => ({
        productName: product.productName,
        quantity: product.quantity,
        productprice: product.price,
        realPrice: product.quantity * product.price,
        images: product.images,
        address: selectedAddress,
        payment: payment,
        userId: userid
      }));


      walletBalance = parseInt(walletBalance - grandtotal);

      const walletHistory = {
        process: 'Ordered',
        amount: grandtotal,
        productname: productName,

      }

      for (const product of data1) {
        const { quantity, productId, productName } = product;

        const existingProduct = await productCollection.findById(productId);
        const currentStock = existingProduct.stock;
        const newStock = currentStock - quantity;

        if (quantity > currentStock) {
          res.status(400).json({ message: 'Out Of Stock' });
          return

        } else {
          const x = await productCollection.updateOne(
            { productname: productName },
            { $set: { stock: newStock } }
          );
        }
      }

      await registercollection.updateOne(
        { email: user },
        { $push: { orders: productOrders, wallethistory: walletHistory }, $set: { walletbalance: walletBalance } }
      );

      const updatedUser = await registercollection.findOneAndUpdate(
        { email: user },
        { $set: { 'cart.items': [] } },
        { new: true }
      );

      const updatedUser1 = await registercollection.findOneAndUpdate(
        { email: user },
        { $unset: { 'cart.grandtotal': 0 } },
        { new: true }
      );

      return res.status(200).json({ message: 'logined', type: 'success' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Logout

const logOut = (req, res) => {
  try {
    if (req.session.user) {
      req.session.user = null
      const successMessage = 'Logged Out Successfully'
      res.redirect(`/?success=${encodeURIComponent(successMessage)}`)
    }
  } catch { res.status(500).redirect('/500') }
};

module.exports = {
  searchProducts, postReturn, editAddress, postEditAddress, verifyCoupon, clearCoupen, cancelReturn, editReview, returnProduct, topUpDone, postEditReview, topUp, deleteReview, login, wallet, myInvoice, review, postReview, paymentDone, userProfile, razorpayOrder, cancelOrder, pagenationOrders, myOrders, editPassword, walletPayment, categoryPage, successPage, editProfile, updatePass, updatePasss, saveAddress, orderSuccess, register, filter, newRegister, loginRegister, userHome, otp, reset, logOut, productDetail, mainHome, shop, resetPass, resetConfirmOtp, getCheckOut, getResetOtp, getCart, addToCart, cartQuantityUpdate, removeProduct
}