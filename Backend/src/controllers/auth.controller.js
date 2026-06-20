const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')
/**
 * @name registerUserController
 * @description register a new user, exprects username, email and password
 * @access public
 */

// async function registerUserController(req,res){
//     const {username,email,password} = req.body;

//     if(!username||!email||!password){
//         return res.status(400).json({
//             message: "Username, email, password all are required"
//         })
//     }

//     const isUserAlreadyExists = await userModel.find({
//         $or:[{username},{email}]
//     })

//     if(isUserAlreadyExists){
//         if(isUserAlreadyExists.username==username){
//             return res.status(400).json({
//                 message: "Username already exists"
//             })
//         }
//         return res.status(400).json({
//             message: "Email is already registered"
//         })
//     }

//     const hash = await bcrypt.hash(password,10)

//     const user = await userModel.create({
//         username,
//         email,
//         password: hash
//     })

//     const token = await jwt.verify(
//         {id: user._id, username: user.username},
//         process.env.JWT_SECRET_KEY,
//         {expiresIn: "1d"}
//     )

//     res.cookie("token",token)

//     res.status(200).json({
//         message: "User registered successfully",
//         user:{
//             id: user._id,
//             username: user.username,
//             email: user.email
//         }
//     })
// }

async function registerUserController(req,res){

    const {username,email,password}=req.body

    if(!username||!email||!password){
        return res.status(400).json({
            message: "Username, email and password are required"
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or:[{username},{email}]
    })

    if(isUserAlreadyExists){
        if(isUserAlreadyExists.username == username){
            return res.status(400).json({
                message: "Username already taken"
            })
        }
        return res.status(400).json({
            message: "Email is already registered"
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    const token = await jwt.sign(
        {id:user._id,username:user.username},
        process.env.JWT_SECRET_KEY,
        {expiresIn: "1d"}
    )

    res.cookie("token",token)

    res.status(201).json({
        message: "User is successfully registered",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in req body
 * @access public
 */

async function loginuserController(req,res){
    const {email,password} = req.body

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(400).json({
            message: "Email is invalid"
        })
    }

    const isValidUser = await bcrypt.compare(password,user.password)

    if(!isValidUser){
        return res.status(400).json({
            message: "Password is invalid"
        })
    }

    const token = jwt.sign(
        {id: user._id,username: user.username},
        process.env.JWT_SECRET_KEY,
        {expiresIn: "1d"}
    )

    res.cookie("token",token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutUserController
 * @description logout user by clearing cookie from the res and adding the token in blackist
 * @access public
 */

async function logoutUserController(req,res){
    const token = req.cookies.token;

    if(token){
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeUserController
 * @description get the details of the logged in user
 * @access public
 */

async function getMeUserController(req,res){
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User data fetched successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {
    registerUserController,
    loginuserController,
    logoutUserController,
    getMeUserController
}