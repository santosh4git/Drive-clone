const express = require('express');
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser');
const fileModel = require('../models/files.models');
const authMiddleware = require('../middlewares/auth');
const cloudinary = require('../config/cloudinary.config');
const upload = require('../middlewares/multer');
const sendVerificationCode = require('../middlewares/email');


const userRoutes = express.Router();

userRoutes.get('/register', (req, res) => {
    res.render('register');
});

userRoutes.post(
    '/register',
    body('userName').trim().isLength({ min: 7 }),
    body('email').trim().isEmail().isLength({ min: 13 }),
    body('password').isLength({ min: 7 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({
                message: 'Invalid data',
                errors: errors.array()
            });
        }

        const { userName, email, password } = req.body;

        try {
            // Check if user already exists to avoid duplicates
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists with this email.' });
            }

            // A critical fix: Hash the password and save the HASHED password, not the plain text one.
            const hashPassword = await bcrypt.hash(password, 10);

            const verificationCode = Math.floor(Math.random()*900000+100000).toString()

            // Create a new user instance with the hashed password
            const newUser = new userModel({
                userName: userName,
                email: email,
                password: hashPassword ,// Corrected: Save the hashed password
                verificationCode:verificationCode
            });

            // Save the new user to the database
            await newUser.save();
            sendVerificationCode(newUser.email,verificationCode)

            // Send a success response
            res.render('verifyEmail', { userName: newUser.userName })
        } catch (error) {
            console.error('Error during user registration:', error);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    }
);

userRoutes.post('/verifyEmail', async (req,res) => {
    const verificationCode = req.body.verificationCode;

    const user = await userModel.findOne({ verificationCode });

    if(!user){
        return res.render('verifyEmail', { error: '❌ Wrong OTP, please try again' });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.render('verifyEmail', { success: '✅ Email verified successfully!' });
});



userRoutes.get('/login',(req,res) => {
    res.render('login')
})

userRoutes.post('/login',
   body('userName').trim().isLength({min:7}),
    body('password').isLength({min:7}),
    async(req,res) => {
        let {userName, password} = req.body

        const user = await userModel.findOne({userName})

        if(!user){
            return res.render('login',{error :'invalid userName or password'})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.render('login',{error:'Invalid userName or password'})
        }

        const token = jwt.sign({
            userId:user._id,
            userName:user.userName,
            email:user.email
        },process.env.JWT_SECRET)

        res.cookie('token',token)
        res.render('dashboard',{userName:user.userName})
    }
) 

userRoutes.get('/upload',authMiddleware,(req,res) => {
    res.render('upload')
})

userRoutes.post('/uploadFile',authMiddleware, upload.single('file'), async(req,res) => {
    try{
        const newFile = await fileModel.create({
            path:req.file.path,
            originalname:req.file.originalname,
            user:req.user.userId
        })
        res.render('successUpload')
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:'fail to upload file, try again'
        })
        
    }
})

userRoutes.get('/renderDashboard',authMiddleware,(req,res) => {
    res.render('dashboard',{userName:req.user.userName})
})

// userRoutes.get('/view',(req,res) => {
//     res.render('view')
// })

userRoutes.get('/myFiles', authMiddleware, async(req,res) => {
    try{
        const files = await fileModel.find({user:req.user.userId})

        res.render('view', {files})
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:'Failed to fetch files'
        })
    }
})
 


module.exports = userRoutes;
