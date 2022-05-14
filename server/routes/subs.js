const express = require('express');
const Subscription = require('../models/subscription');
const { requireSignin } = require('../middlewares/index');

const router = express.Router();
const {
  prices,
  createSubscription,
  subscriptionStatus,
  subscriptions,
  customerPortal,
  getSubscriptions,
  getActiveUsers,

} = require('../controllers/subs');

router.get('/api/prices', prices);
router.post('/api/create-subscription', requireSignin, createSubscription);
router.get('/api/subscription-status', requireSignin, subscriptionStatus);
router.get('/api/subscriptions', requireSignin, subscriptions);
router.get('/api/customer-portal', requireSignin, customerPortal);
router.post('/api/getsubscriptions', requireSignin, getSubscriptions);
router.get('/api/active-users', getActiveUsers);
// router.post('/webhook', express.raw({ type: "*/*" }), customerUpdate)

module.exports = router;

