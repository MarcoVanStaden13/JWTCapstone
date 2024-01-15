const EXPRESS = require('express')
const BODYPARSER = require('body-parser')
const mongoose = require('mongoose');
const APP = EXPRESS()
const HELMET = require('helmet')
const JWT = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const PORT = process.env.PORT || 8080;

//Routes
const routes = require('./routes/routes.js');

// Use Helmet for enhanced security
APP.use(HELMET())

require('dotenv').config()

APP.use(EXPRESS.static('public')) // Serve static files from the 'public' directory
APP.use(EXPRESS.json()) // Parse incoming JSON requests
APP.use(BODYPARSER.urlencoded({ extended: true })) // Parse incoming form data

// Routes
APP.use('/', routes)

// Listen for responses on the given port
APP.listen(PORT, function () {
    console.log(`Example APP listening on port ${PORT}!`)
})