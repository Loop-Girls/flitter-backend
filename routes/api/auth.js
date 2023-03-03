'use strict';

const express = require('express');
const createError = require('http-errors');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const router = express.Router();
//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '', username: '' }

    //incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'that email in not registered';
    }

    //duplicate error code
    if (err.code === 11000) {
        if (err.message.includes('username')) {
            errors.username = 'That username is already registered'
        } else {
            errors.email = 'That email is already registered'
        }

        return errors;
    }

    //validation errors 
    if (err.message.includes('Users validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });

    }

    return errors;
}
//create token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { //return a token signed
        expiresIn: maxAge //valid for this long
    });
};

//signup: create user

router.post('/signup', async (req, res, next) => {
    try {

        const adData = req.body;

        // instanciate new ad in the memory
        const user = new User(adData);
        const token = createToken(user._id);
       // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 }); //returns cookie

        // save it in de database
        const savedUser = await user.save();
        // res.send({ savedUser, token });
        res.status(201).json({ savedUser, token }); //return token
   
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});
//login
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        if (user != null) {
            //create token
            const token = createToken(user._id);
            res.send({ token, user });
        } else {
            res.status(400).json({ error: 'Credential not valid' });
        }
    } catch (err) {
        console.log('error with login ' + err);
    }
});
router.get('/profile/:id', async (req, res, next) => {
    try {

        const id = req.params.id;

        // Search for an ad in database
        const user = await User.findById(id);

        res.send(user);

    } catch (err) {
        next(err);
    }
});
router.post('/forgot/', async (req, res, next) => {
    try {

        const { email } = req.body;

        // Search for an ad in database
        const user = await User.findOne({ email });
        if (!user) {
            res.send("Email not found");
        } else {
            //create one time link valid for 15 minutes
            const secret = process.env.JWT_SECRET + user.password;
            const payload = {
                email: user.email,
                id: user._id
            }
            const token = jwt.sign(payload, secret, { expiresIn: '15m' });
            //TODO: 
            const link = `http://localhost:8080/#/reset-password/${user._id}&${token}`;
            console.log(link);
            //send email with link to reset password
            var transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE,
                auth: {
                    user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_EMAIL_PASSWORD
                }
            });

            var mailOptions = {
                from:  process.env.ADMIN_EMAIL,
                to: user.email,
                subject: 'Flipper - Reset Password',
                text: `We have received a request to reset your password. Please click the link if you still want to reset it: ${link}`
            };
            try {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.send('Password reset link has been sent to your email');
            } catch (error) {
                res.send('Error');
            }
           
        }
    } catch (err) {
        next(err);
    }
});
router.post('/reset-password', async (req, res, next) => {
    const { userId, token, password } = req.body;
    
    //TODO: continue
    console.log(password);
    const user = await User.findById(userId);
    if (user) {
         //we have a valid id and a valid user with this id.
        const secret = process.env.JWT_SECRET + user.password;
        try {
            const payload = jwt.verify(token, secret);
            if(payload){
                const salt = await bcrypt.genSalt();
                //get hash version of the password
                const hashPassword = await bcrypt.hash(password, salt);
                User.updateOne({_id:userId}, 
                    {password:hashPassword}, function (err, docs) {
                    if (err){
                        console.log(err);
                        res.status(400).json({ error: 'Error updating password' });
                    }
                    else{
                        console.log("Updated Docs : ", docs);
                        res.send({message: 'Password changed'});
                    }
                });
                
                
            }
        
        } catch (error) {
            console.log(error);
            res.send(error.message);
        }
       
    }else{
        res.status(400).json({ error: 'User not found' });
    }

})


module.exports = router;