const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware')
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

/**
 * @route GET /api/auth/get-me
 * @description Get the details of the user if logged in
 * @access public
 */

router.get('/get-me',authMiddleware.authUser,authController.getMeUserController,)

module.exports = router;