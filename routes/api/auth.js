'use strict';

const express = require('express');
const createError = require('http-errors');
const User = require('../../models/User');

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {

        const adData = req.body;

        // instanciate new ad in the memory
        const user = new User(adData);

        // save it in de database
        const savedUser = await user.save();

        res.json({ result: savedUser});
        // }


    } catch (err) {
        next(err);
    }
});