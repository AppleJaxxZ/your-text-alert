const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail, sendCancelationEmail } = require('../Emails/emails');
const { validateDate, validatePassword } = require('../helpers/auth');
const validator = require('validator');
const { auth } = require('../middlewares/index');
const Subscription = require('../models/subscription');
const stripe = require('stripe')(process.env.STRIPE_SECERET);

require('dotenv').config();

const register = async (req, res) => {


  try {
    const {
      name,
      email,
      password,
      checkPassword,
      dateOfBirth,
      pinNumber,
      phoneNumber,
    } = req.body;
    if (!name) {
      return res.json({
        error: 'Name is required',
      });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: 'Password is required and should be 6 characters long',
      });
    }

    if (password !== checkPassword) {
      return res.json({
        error: 'Passwords do not match, please re-enter your password',
      });
    }

    if (!validatePassword(password)) {
      return res.json({
        error:
          'Password must Have one UPPERCASE, one lowercase, and one special character !@#$%^&*',
      });
    }

    if (pinNumber.length < 7) {
      return res.json({
        error:
          'Pin Number is too short!  Please enter your Aver-Health assigned 7 digit pin number.',
      });
    }

    if (phoneNumber.length !== 11) {
      return res.json({
        error:
          'Phone number is too short!  Please enter your VAILD phone number to send alerts too starting with a 1.  Example: 14846572222',
      });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        error:
          'Please enter a VALID email address, if you dont have a valid email address head over to google.com yahoo.com protonmail.com or any other email hosting website.',
      });
    }

    if (!validateDate(dateOfBirth)) {
      return res.json({
        error: 'Invalid Date of birth, must be in mm/dd/yyyy format!',
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({ error: 'Email is taken' });
    }

    //hashPassword
    const hashedPassword = await hashPassword(password);

    //create account in stripe
    const customer = await stripe.customers.create({
      email, phone: phoneNumber, name: name, metadata: { dateOfBirth: dateOfBirth, pinNumber: pinNumber }
    });
    try {
      const user = await new User({
        name,
        email,
        password: hashedPassword,
        dateOfBirth,
        phoneNumber,
        pinNumber,
        stripe_customer_id: customer.id,
      }).save();


      // create signed token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      // console.log(user)
      const { password, ...rest } = user._doc;
      return res.json({
        token,
        user: rest,
      });
    } catch (err) {
      console.log(err);
    }
    res.json({
      data: 'This is /register endpoint',
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    //check for email
    const user = await User.findOne({ email: req.body.email })
      .populate('subscriptions')
      .exec();



    if (!user) {
      return res.json({ error: 'No user found!' });
    }

    //check password
    const match = await comparePassword(req.body.password, user.password);
    if (!match) {
      return res.json({
        error: 'Wrong password',
      });
    }
    // create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const { password, ...rest } = user._doc;

    res.json({
      token,
      user: rest,
    });
  } catch (error) {
    console.log(error.response);
  }
};

const deleteUser = async (req, res) => {
  try {
    const sub = req.body.stripe_customer_id;

    const deleted = await stripe.customers.del(sub)
    await User.deleteMany({ _id: req.body._id });
    await Subscription.deleteMany({ customer: sub })


    // await sendCancelationEmail(req.body.email, req.body.name);

    res.send('Your account has been deleted and your subscription will be cancled at the end of this billing cycle.').status(200);
  } catch (e) {
    res.status(500).send(e.response);
  }
};

const forgotPassword = async (req, res) => {
  try {

    const user = await User.findOne({ email: req.body.email, pinNumber: req.body.pinNumber })


    // console.log('user', user);

    if (!user) {
      return res.json({ error: 'No user found!' });
    }

    console.log("User was found", user)
    const password = req.body.password;
    const hashedPassword = await hashPassword(password);

    const updatedUser = await User.findOneAndUpdate(
      { email: req.body.email },
      { password: hashedPassword },
      { new: true }

    )
    res.send("Password has been changed successfully!")

  } catch (error) {
    res.status(500).send()
  }
}


module.exports = { deleteUser, login, register, forgotPassword }