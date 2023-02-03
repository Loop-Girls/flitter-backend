'use strict';

const express = require('express');
const createError = require('http-errors');
const User = require('../../models/User');

const router = express.Router();

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' }

    //duplicate error code
    if (err.code === 11000) {
        errors.email = 'That email is already registered'
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


//signup: create user

router.post('/signup', async (req, res, next) => {
    try {

        const adData = req.body;

        // instanciate new ad in the memory
        const user = new User(adData);

        // save it in de database
        const savedUser = await user.save();

        // res.json({ result: savedUser });
        // }
        res.status(201).json(savedUser);
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});

module.exports = router;