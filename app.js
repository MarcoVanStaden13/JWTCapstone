const EXPRESS = require('express')
const BODYPARSER = require('body-parser')
const mongoose = require('mongoose');
const APP = EXPRESS()
const HELMET = require('helmet')
const JWT = require('jsonwebtoken')
const PORT = process.env.PORT || 8080

// Use Helmet for enhanced security
APP.use(HELMET())

require('dotenv').config()

APP.use(EXPRESS.static('public')) // Serve static files from the 'public' directory
APP.use(EXPRESS.json()) // Parse incoming JSON requests
APP.use(BODYPARSER.urlencoded({ extended: true })) // Parse incoming form data

// Connect to MongoDB
const uri = 'mongodb+srv://marco:hyperionPassword123@capstone.ahbbpec.mongodb.net/SiteData';
mongoose.connect(uri);

mongoose.connection.on('error', function () {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});
mongoose.connection.once('open', function () {
  console.log('Successfully connected to the database');

});


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String },
    department: { type: String }
});

const Users = mongoose.model('Users', userSchema);



APP.post('/login', async (req, res) => {
    const uName = req.body.username
    const pWord = req.body.password

    try {
        const user = await Users.findOne({ username: uName, password: pWord });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = {
            username: user.username,
            level: user.role,
            department: user.department,
        };

        const token = JWT.sign(payload, "JWT-Secret", { algorithm: 'HS256' });
        console.log(token);
        console.log(payload);
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

APP.post('/register', async (req, res) => {
    const { username, password, department } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await Users.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Create a new user
        const newUser = new Users({
            username,
            password,
            role: 'normal', // Set the default role or modify as needed
            department,
        });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// const verifyJWT = (req, res, next) => {
//     const token = req.headers['authorization']

//     if (!token){
//         res.send('no token given')
//     } else{
//         JWT.verify(token, "JWT-Secret", (err, decoded) => {
//             if(err){
//                 res.json({auth: false, message: "bad jwt"})
//             } else {
//                 req.username = decoded.username;
//                 next();
//             }
//         })
//     }
// }

APP.get('/verify', (req, res) => {
    const auth = req.headers['authorization']
    const token = auth.split(' ')[1]
    
    try {
        const decoded = JWT.verify(token, 'JWT-Secret')
        res.send(decoded)
    }catch (err) {
        res.status(401).send({'err': 'Bad JWT!'})
    }
})


// Listen for responses on the given port
APP.listen(PORT, function () {
    console.log(`Example APP listening on port ${PORT}!`)
})