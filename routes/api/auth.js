'use strict';

const express = require('express');
const createError = require('http-errors');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const app = require('../../app');

const router = express.Router();
//TODO: save secret in a safe place
const JWT_SECRET = 'loop girls secret';
//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '', username: ''}

    //incorrect email
    if(err.message === 'incorrect email'){
        errors.email = 'that email in not registered';
    }

    //duplicate error code
    if (err.code === 11000) {
        if(err.message.includes('username')){
            errors.username = 'That username is already registered'
        }else{
            errors.email= 'That email is already registered'
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
const maxAge = 3*24*60*60;
const createToken  = (id) =>{
    return jwt.sign({id}, JWT_SECRET, { //return a token signed
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
        res.cookie('jwt',token,{httpOnly:true, maxAge: maxAge*1000}); //returns cookie

        // save it in de database
        const savedUser = await user.save();

        res.status(201).json({savedUser, token}); //return token
        
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});
//login
router.post('/login', async (req, res, next) => {
    const {email, password}= req.body;
    try {
        const user = await User.login(email, password);
        //create token and return it in a cookie
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge});
        res.status(200).json({user, token});
        
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
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

        const {email}= req.body;
  
        // Search for an ad in database
        const user = await User.findOne({email});
        if(!user){
            res.send("Email not found");
        }else{
            //create one time link valid for 15 minutes
        const secret = JWT_SECRET + user.password;
        const payload = {
            email: user.email,
            id: user._id
        }
        const token = jwt.sign(payload, secret, {expiresIn: '15m' });
        const link = `http://localhost:8080/reset-password/${user._id}/${token}`;
        console.log(link);
        res.send('Password reset link has been sent to your email');
        }
       
 
  
    } catch (err) {
        next(err);
    }
});
router.get('/reset-password/:id/:token', async (req, res, next) => {
    const{id, token} = req.params;
    const user = await User.findOne({id});
    if(id !==user._id){
        res.send('Invalid id')
    }
    //we have a valid id and a valid user with this id.
    const secret = JWT_SECRET + user.password;
    try {
        const payload = jwt.verify(token, secret);
        res.send({email: user.email});
    } catch (error) {
        console.log(error);
        res.send(error.message);
        
    }

})


module.exports = router;