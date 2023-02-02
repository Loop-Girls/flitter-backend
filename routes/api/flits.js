'use strict';

const express = require('express');
const createError = require('http-errors');
const Flit = require('../../models/Flit');

const router = express.Router();


// CRUD

// POST /apiv1/flits(body=adData)
// Create a flit
router.post('/apiv1/flits', async (req, res, next) => {
    try {

        const adData = req.body;

        // instanciate new ad in the memory
        const flit = new Flit(adData);

        // save it in de database
        const savedFlit = await flit.save();

        res.json({ result: savedFlit });
        // }


    } catch (err) {
        next(err);
    }
});

// GET /apiv1/flits
// Returns list of flits
router.get('/', async (req, res, next) => {
    try {

        // filters
        const author = req.query.author;
        const image = req.query.image;
        const message = req.query.message;
        const kudos = req.query.kudos.length;
        // pagination /apiv1/flits?skip=1&limit=1
        const skip = req.query.skip;
        const limit = req.query.limit;
        // fields selection
        const fields = req.query.fields; // /apiv1/flits?fields=name -_id
        // sort
        const sort = req.query.sort; // /apiv1/flits?sort=date%20name

        const filtro = {};

        if (author) { // /apiv1/ads?author=Bi
            // search for a product that it starts with those letters
            filtro.author = new RegExp('^' + req.query.author, "i");;
        }
        if (message) { // /apiv1/ads?message=Bi
            // search for a product that it starts with those letters
            filtro.message = new RegExp('^' + req.query.message, "i");;
        }
       
        if (image) {// /apiv1/flits?image=false
            filtro.image = image.toLocaleLowerCase();
        }


        //   if (tag) {// /apiv1/ads?tags=lifestyle,work
        //     if (tag.includes(',')) {
        //       filtro.tags = { '$all': tag.split(',') }
        //     } else {// 1 tag query /apiv1/ads?tags=mobile
        //       filtro.tags = { '$in': tag };
        //     }

        //   }
        // /apiv1/flits?kudos=1000
        if (kudos) {
            if (kudos.includes('-')) {
                if (kudos.charAt(0) === '-') {// /apiv1/flits?kudos=-50 Search for product less or equal than 50
                    const maxKudos = kudos.slice(1);
                    filtro.kudos= { '$lte': maxKudos };
                    console.log(maxKudos);
                } else if (kudos.slice(-1) === '-') {  // /apiv1/flits?kudos=10- Search for product greater or equal than 10
                    const minKudo = kudos.split('-');
                    filtro.kudos = { '$gte': (minKudo[0]) };
                } else {
                    // /apiv1/flits?price=0-50 Search for product between 0-50 price
                    const minMaxArray = kudos.split('-');
                    const min = minMaxArray[0];
                    const max = minMaxArray[1];
                    filtro.kudos = { '$gte': min, '$lte': max };
                }

            } else {// /apiv1/flits?kudo=32
                filtro.kudos = kudos;
            }
        }


        const flits = await Flit.lista(filtro, skip, limit, fields, sort);
        res.json({ results: flits });
    } catch (err) {
        next(err);
    }
});

// GET /apiv1/flits/(id)
// Returns a flit
router.get('/:id', async (req, res, next) => {
    try {

        const id = req.params.id;

        // Search for an ad in database
        const flit = await Flit.findById(id);

        res.json({ result: flit });

    } catch (err) {
        next(err);
    }
});

// CRUD

// POST /apiv1/flits(body=adData)
// Create a flit
router.post('/apiv1/flits', async (req, res, next) => {
    try {

        const adData = req.body;

        // instanciate new ad in the memory
        const flit = new Flit(adData);

        // save it in de database
        const savedFlit = await flit.save();

        res.json({ result: savedFlit });
        // }


    } catch (err) {
        next(err);
    }
});

// GET /apiv1/flits
// Returns list of flits
router.get('/', async (req, res, next) => {
    try {

        // filters
        const author = req.query.author;
        const image = req.query.image;
        const message = req.query.message;
        const kudos = req.query.kudos.length;
        // pagination /apiv1/flits?skip=1&limit=1
        const skip = req.query.skip;
        const limit = req.query.limit;
        // fields selection
        const fields = req.query.fields; // /apiv1/flits?fields=name -_id
        // sort
        const sort = req.query.sort; // /apiv1/flits?sort=date%20name

        const filtro = {};

        if (author) { // /apiv1/ads?author=Bi
            // search for a product that it starts with those letters
            filtro.author = new RegExp('^' + req.query.author, "i");;
        }
        if (message) { // /apiv1/ads?message=Bi
            // search for a product that it starts with those letters
            filtro.message = new RegExp('^' + req.query.message, "i");;
        }
       
        if (image) {// /apiv1/flits?image=false
            filtro.image = image.toLocaleLowerCase();
        }


        //   if (tag) {// /apiv1/ads?tags=lifestyle,work
        //     if (tag.includes(',')) {
        //       filtro.tags = { '$all': tag.split(',') }
        //     } else {// 1 tag query /apiv1/ads?tags=mobile
        //       filtro.tags = { '$in': tag };
        //     }

        //   }
        // /apiv1/flits?kudos=1000
        if (kudos) {
            if (kudos.includes('-')) {
                if (kudos.charAt(0) === '-') {// /apiv1/flits?kudos=-50 Search for product less or equal than 50
                    const maxKudos = kudos.slice(1);
                    filtro.kudos= { '$lte': maxKudos };
                    console.log(maxKudos);
                } else if (kudos.slice(-1) === '-') {  // /apiv1/flits?kudos=10- Search for product greater or equal than 10
                    const minKudo = kudos.split('-');
                    filtro.kudos = { '$gte': (minKudo[0]) };
                } else {
                    // /apiv1/flits?kudos=0-50 Search for product between 0-50 price
                    const minMaxArray = kudos.split('-');
                    const min = minMaxArray[0];
                    const max = minMaxArray[1];
                    filtro.kudos = { '$gte': min, '$lte': max };
                }

            } else {// /apiv1/flits?kudo=32
                filtro.kudos = kudos;
            }
        }


        const flits = await Flit.lista(filtro, skip, limit, fields, sort);
        res.json({ results: flits });
    } catch (err) {
        next(err);
    }
});

// GET /apiv1/flits/(id)
// Returns a flit
router.get('/:id', async (req, res, next) => {
    try {

        const id = req.params.id;

        // Search for an ad in database
        const flit = await Flit.findById(id);

        res.json({ result: flit });

    } catch (err) {
        next(err);
    }
});

module.exports = router;