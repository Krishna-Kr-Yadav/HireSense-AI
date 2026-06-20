const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user with username,email, and password
 * @access public
 */

router.post('/register',authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description Login user with email and password
 * @access public
 */
router.post('/login',authController.loginuserController)


/**
 * @route POST /api/auth/logout
 * @description Logout user 
 * @access public
 */
router.get('/logout',authController.logoutUserController)


module.exports = router;