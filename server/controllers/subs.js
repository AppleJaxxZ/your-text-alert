const User = require('../models/user');
const Subscription = require('../models/subscription');
const mongoose = require('mongoose');
var AWS = require('aws-sdk');
const stripe = require('stripe')(process.env.STRIPE_SECERET);
require('dotenv').config();

AWS.config.update({ accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_KEY, region: 'us-east-1' });
const prices = async (req, res) => {
  const prices = await stripe.prices.list();
  res.json(prices.data.reverse());
};

const createSubscription = async (req, res) => {
  // console.log(req.body)
  try {
    const user = await User.findById(req.user._id);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      customer: user.stripe_customer_id,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    console.log('checkout session', session);
    res.json(session.url);
  } catch (error) {
    console.log(error);
  }
};

const getSubscriptions = async (req, res) => {
  try {
    let subs = await Subscription.find({
      _id: { $in: req.body.subscriptions },
    });
    res.send({ subscriptions: subs });
  } catch (error) {
    res.send(error.response);
  }
};

const getActiveUsers = async (req, res) => {
  const lambda = new AWS.Lambda();
  const activeUser = await Subscription.aggregate([
    {
      $match: {
        status: 'active',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $group: {
        // get Fields from group
        _id: '$email',
        status: { $first: '$$ROOT.status' },

        dateOfBirth: { $first: '$$ROOT.user.dateOfBirth' },
        pinNumber: { $first: '$$ROOT.user.pinNumber' },
        phoneNumber: { $first: '$$ROOT.user.phoneNumber' },
      },
    },
    {
      $project: {
        _id: 0,
        email: '$_id',
        status: '$status',
        dateOfBirth: '$dateOfBirth',
        pinNumber: '$pinNumber',
        phoneNumber: '$phoneNumber',
      },
    },
  ]);
  try {
    await activeUser.forEach(user => {
      console.log(user)
      const params = {
        FunctionName: 'newestScraper', /* required */
        Payload: JSON.stringify({
          pinNumber: user.pinNumber,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
        })
      };
      console.log(params.Payload)
      lambda.invoke(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); return data;         // successful response
      });

    })
    return res.json("Lambdas launched")
  } catch (err) {
    console.log(err)
  }

  res.send(activeUser);
};

const subscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripe_customer_id,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    const { id, ...rest } = subscriptions.data[subscriptions.data.length - 1];
    const saveSubscriptionMongo = {
      user_id: user._id,
      name: user.name,
      email: user.email,
      stripe_id: id,
      ...rest,
    };



    const findSubscription = await Subscription.findOne({
      user_id: user._id
    })

    //Can you find a subscription already in database?  if not create one.



    if (!findSubscription) {
      const createNewSubscription = await Subscription.create(
        (
          { user_id: user._id },
          saveSubscriptionMongo
        )
      )


    }

    const updatedSubscription = await Subscription.findOneAndUpdate(
      { user_id: user._id },
      saveSubscriptionMongo,
      { new: true, overwrite: true }
    );

    const findSubscription2 = await Subscription.findOne({
      user_id: user._id
    })



    const updatedUserObject = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { subscriptions: findSubscription2._id } },

      { new: true }
    )
      .populate('subscriptions')
      .exec();



    res.json(updatedUserObject);
  } catch (error) {
    console.log(error);
  }
};

const subscriptions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripe_customer_id,
      status: 'all',
      expand: ['data.default_payment_method'],
    });
    res.json({ subscriptions });
  } catch (error) {
    console.log(error.response);
  }
};

const customerPortal = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: process.env.STRIPE_SUCCESS_URL,
    });
    res.json(portalSession.url);
  } catch (error) {
    console.log(error);
  }
};



// const customerUpdate = async (request, response) => {
//   const endpointSecret = process.env.STRIPE_WEBSECRET;
//   const stripePayload = request.body;
//   console.log('THIS IS PAYLOAD', stripePayload);
//   const sig = request.headers['stripe-signature'];
//   console.log('THIS IS THE SIG', sig);

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(stripePayload, sig, endpointSecret);
//   } catch (err) {
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'subscription_schedule.updated':
//       const subId = event.data.object.subscription;
//       const subObject = event.data.object;
//       console.log('THIS IS THE SUBSCRIPTION OBJECT', subId);
//       // Then define and call a function to handle the event payment_intent.succeeded
//       // console.log("CUSTOMER ID", customerId)
//       // const subscription = await stripe.subscriptions.retrieve(subId);
//       const customer = await Subscription.findOneAndUpdate(
//         { stripe_id: subId },
//         { subObject },
//         { new: true, overwrite: true }
//       );
//       console.log('FOUND CUSTOMER SUB', customer);
//       break;

//     case 'customer.subscription.updated':
//       const subScriptId = event.data.object.subscription;
//       const subObj = event.data.object;
//       console.log('THIS IS THE SUBSCRIPTION OBJECT ID', subScriptId);
//       // const subScript = await stripe.subscriptions.retrieve(subScriptId);
//       const customerSub = await Subscription.findOneAndUpdate(
//         { stripe_id: subScriptId },
//         { subObj },
//         { new: true, overwrite: true }
//       );



//       break;
//     case 'customer.updated':
//       const customerId = event.data.object.id;
//       const customerObject = event.data.object;
//       console.log("CUSTOMER'S ID FROM WEBHOOK", customerObject);

//       const customerUpdate = await User.findOneAndUpdate(
//         { stripe_customer_id: customerId },
//         { customerObject },
//         { new: true, overwrite: true }
//       );

//       break;

//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send('Success!');
// };



module.exports = { createSubscription, prices, getActiveUsers, getSubscriptions, subscriptionStatus, customerPortal, subscriptions }