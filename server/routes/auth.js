const express = require('express')


const router = express.Router();
const { register, login, deleteUser, forgotPassword } = require('../controllers/auth');
const { requireSignin } = require('../middlewares');


router.post("/api/register", register);
router.post("/api/login", login);
router.post("/api/forgotPassword", forgotPassword)
router.delete("/api/deleteUser", deleteUser)




module.exports = router