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
const uri = 'mongodb+srv://marco:hyperionPassword123@capstone.ahbbpec.mongodb.net/UserData';
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
    department: { type: String },
    division: { type: String },
});

const Users = mongoose.model('Users', userSchema);


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

const siteDataSchema = new mongoose.Schema({
    _id: String,
    Logins: {
        type: Map,
        of: new mongoose.Schema({
            username: { type: String, required: true },
            password: { type: String, required: true },
        }),
    },
});

// Define models for SiteData collections
const SoftwareReviewsModel = siteDataConnection.model('software_reviews', siteDataSchema);
const HardwareReviewsModel = siteDataConnection.model('hardware_reviews', siteDataSchema);
const OpinionPublishingModel = siteDataConnection.model('opinion_publishing', siteDataSchema, 'opinion_publishing');
const NewsManagementModel = siteDataConnection.model('news_management', siteDataSchema, 'news_management');


APP.get('/data/:department/:division?', async (req, res) => {
    const auth = req.headers['authorization'];
    const token = auth.split(' ')[1];

    try {
        const decoded = JWT.verify(token, 'JWT-Secret');

        const userLevel = decoded.level;
        const userDepartment = decoded.department;
        const userDivision = decoded.division;

        const requestedDepartment = req.params.department;
        const requestedDivision = req.params.division || 'all'; // Default to 'all' if division is not provided

        // Check if the user is accessing their own department
        if (userLevel === 'normal' && (userDepartment !== requestedDepartment || userDivision !== requestedDivision)) {
            return res.status(403).json({ error: 'Access forbidden' });
        }


        if (userLevel === 'admin') {
            console.log('Admin level access');

            // Fetch all documents in all collections
            const allDocuments = await Promise.all([
                NewsManagementModel.find({}),
                SoftwareReviewsModel.find({}),
                HardwareReviewsModel.find({}),
                OpinionPublishingModel.find({})
            ]);

            const result = {
                news_management: allDocuments[0],
                software_reviews: allDocuments[1],
                hardware_reviews: allDocuments[2],
                opinion_publishing: allDocuments[3]
            };

            res.json(result);
            return;
        }

        // Choose the appropriate model based on the user's division
        let documentModel;
        switch (requestedDepartment) {
            case 'news_management':
                documentModel = NewsManagementModel;
                break;
            case 'software_reviews':
                documentModel = SoftwareReviewsModel;
                break;
            case 'hardware_reviews':
                documentModel = HardwareReviewsModel;
                break;
            case 'opinion_publishing':
                documentModel = OpinionPublishingModel;
                break;
            default:
                return res.status(400).json({ error: 'Invalid department' });
        }

        if (userLevel === 'manager' && userDepartment === requestedDepartment) {
            if (requestedDivision === 'all') {
                // Fetch all documents in the department for managers
                const allDocuments = await documentModel.find({});
                res.json({ allDocuments });
            } else {
                // Send an error if a specific division is provided for managers
                return res.status(400).json({ error: 'Invalid division' });
            }
        } else {
            // Fetch the document from the database based on division
            const document = await documentModel.findOne({
                _id: requestedDivision,
            });

            if (!document) {
                return res.status(404).json({ error: 'Document not found' });
            }

            // Send the requested document to the user
            res.json({ document });
        }
    } catch (err) {
        res.status(401).send({ err: 'Bad JWT!' });
    }
});

// Add a new endpoint to get all users if the user is an admin
APP.get('/allUsers', async (req, res) => {
    try {
        const auth = req.headers['authorization'];
        const token = auth.split(' ')[1];
        const decoded = JWT.verify(token, 'JWT-Secret');

        // Check if the user is an admin
        if (decoded.level !== 'admin') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Fetch all users
        const allUsers = await Users.find({});
        res.json(allUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new route for updating SiteData
APP.put('/data/:department/:division/:documentId', async (req, res) => {
    const auth = req.headers['authorization'];
    const token = auth.split(' ')[1];

    try {
        const decoded = JWT.verify(token, 'JWT-Secret');

        const userLevel = decoded.level;
        const userDepartment = decoded.department;
        const userDivision = decoded.division;

        const requestedDepartment = req.params.department;
        const requestedDivision = req.params.division || 'all'; // Default to 'all' if division is not provided
        const documentId = req.params.documentId;

        // Check if the user is accessing their own department
        if (userLevel === 'normal' && (userDepartment !== requestedDepartment || userDivision !== requestedDivision)) {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        // Choose the appropriate model based on the user's department
        let documentModel;
        switch (requestedDepartment) {
            case 'news_management':
                documentModel = NewsManagementModel;
                break;
            case 'software_reviews':
                documentModel = SoftwareReviewsModel;
                break;
            case 'hardware_reviews':
                documentModel = HardwareReviewsModel;
                break;
            case 'opinion_publishing':
                documentModel = OpinionPublishingModel;
                break;
            default:
                return res.status(400).json({ error: 'Invalid department' });
        }

        // Check user permissions based on role and department
        if ((userLevel === 'admin') || (userLevel === 'manager' && userDepartment === requestedDepartment)) {
            // Find and update the document in the specified collection
            const updatedDocument = await documentModel.findOneAndUpdate(
                { _id: documentId },
                { $set: req.body }, // Assuming that the request body contains the updated data
                { new: true } // Return the updated document
            );

            if (!updatedDocument) {
                return res.status(404).json({ error: 'Document not found' });
            }

            res.json({ document: updatedDocument });
        } else {
            return res.status(403).json({ error: 'Access forbidden' });
        }
    } catch (err) {
        res.status(401).send({ err: 'Bad JWT!' });
    }
});

// Add a new endpoint to update passwords and usernames
APP.post('/updateData/:department/:division', async (req, res) => {
    try {
        const auth = req.headers['authorization'];
        const token = auth.split(' ')[1];
        const decoded = JWT.verify(token, 'JWT-Secret');

        // Check if the user is an admin
        if (decoded.level !== 'admin') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        const department = req.params.department;
        const division = req.params.division;
        const newData = req.body;

        // Choose the appropriate model based on the user's department
        let documentModel;
        switch (department) {
            case 'news_management':
                documentModel = NewsManagementModel;
                break;
            case 'software_reviews':
                documentModel = SoftwareReviewsModel;
                break;
            case 'hardware_reviews':
                documentModel = HardwareReviewsModel;
                break;
            case 'opinion_publishing':
                documentModel = OpinionPublishingModel;
                break;
            default:
                return res.status(400).json({ error: 'Invalid department' });
        }

        // Find the document based on department and division
        const document = await documentModel.findOne({ _id: division });

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Update or add new Logins data
        document.Logins = newData;

        // Save the updated document
        await document.save();

        res.json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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
            division: user.division,
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
    const { username, password, department, division } = req.body;

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
            division,
        });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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