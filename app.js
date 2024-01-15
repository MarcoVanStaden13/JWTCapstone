const EXPRESS = require('express')
const BODYPARSER = require('body-parser')
const mongoose = require('mongoose');
const APP = EXPRESS()
const HELMET = require('helmet')
const JWT = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const PORT = process.env.PORT || 8080;

//Routes
// const getDataRoute = require('./routes/getSiteDataRoute.js')
// const getUsersRoute = require('./routes/getUsersRoute.js')
// const updateCredentials = require('./routes/updateCredentialRoute.js')
// const createCredential = require('./routes/createCredentialRoute.js')
// const assignUser = require('./routes/assignUserRoute.js')
// const changeUserRole = require('./routes/changeUserRoleRoute.js')
// const loginUsers = require('./routes/loginUserRoute.js')
// const registerUser = require('./routes/registerUserRoute.js')
const routes = require('./routes/routes.js');

// Use Helmet for enhanced security
APP.use(HELMET())

require('dotenv').config()

APP.use(EXPRESS.static('public')) // Serve static files from the 'public' directory
APP.use(EXPRESS.json()) // Parse incoming JSON requests
APP.use(BODYPARSER.urlencoded({ extended: true })) // Parse incoming form data

// Connect to MongoDB
const uri = 'mongodb+srv://marco:hyperionPassword123@capstone.ahbbpec.mongodb.net/UserData';
mongoose.connect(uri);

mongoose.connection.on('error', function () {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});
mongoose.connection.once('open', function () {
  console.log('Successfully connected to the database');

});

// Connect to SiteData MongoDB
const siteDataUri = 'mongodb+srv://marco:hyperionPassword123@capstone.ahbbpec.mongodb.net/SiteData';
const siteDataConnection = mongoose.createConnection(siteDataUri);

siteDataConnection.on('error', function () {
    console.log('Could not connect to the SiteData database. Exiting now...');
    process.exit();
});
siteDataConnection.once('open', function () {
    console.log('Successfully connected to the SiteData database');
});


// Routes
// APP.use('/', getDataRoute); // Route to get data
// APP.use('/', getUsersRoute);// Route to get users for admins
// APP.use('/', updateCredentials);// Route to update site credentials
// APP.use('/', createCredential);// Route to add site credentials
// APP.use('/', unassignAssignUser);// Route to assign and desiggn users from departments/divisions
// APP.use('/', changeUserRole);// Route to change user roles
// APP.use('/', loginUsers);// Route to login user
// APP.use('/', registerUser);// Route to register user

APP.use('/', routes)


// APP.get('/verify', (req, res) => {
//     const auth = req.headers['authorization']
//     const token = auth.split(' ')[1]
    
//     try {
//         const decoded = JWT.verify(token, 'JWT-Secret')
//         res.send(decoded)
//     }catch (err) {
//         res.status(401).send({'err': 'Bad JWT!'})
//     }
// })


// Listen for responses on the given port
APP.listen(PORT, function () {
    console.log(`Example APP listening on port ${PORT}!`)
})