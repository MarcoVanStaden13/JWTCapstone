const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const Users = require('../models/users.model.js')

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
const siteDataSchema = require('../models/siteData.model.js')
const siteDataConnection = mongoose.createConnection('mongodb+srv://marco:hyperionPassword123@capstone.ahbbpec.mongodb.net/SiteData');
siteDataConnection.on('error', function () {
    console.log('Could not connect to the SiteData database. Exiting now...');
    process.exit();
});
siteDataConnection.once('open', function () {
    console.log('Successfully connected to the SiteData database');
});

// Define models for SiteData collections
const SoftwareReviewsModel = siteDataConnection.model('software_reviews', siteDataSchema);
const HardwareReviewsModel = siteDataConnection.model('hardware_reviews', siteDataSchema);
const OpinionPublishingModel = siteDataConnection.model('opinion_publishing', siteDataSchema, 'opinion_publishing');
const NewsManagementModel = siteDataConnection.model('news_management', siteDataSchema, 'news_management');

// Function gets relevant data and sends data to frontend
exports.getData = async function (req, res) {
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
            // Fetch all documents in the department for managers
            const allDocuments = await documentModel.find({});
            res.json({ allDocuments });
        } else {
            // Fetch the document from the database based on division
            const document = await documentModel.find({
                division: requestedDivision,
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
}

// Function gets users for the admin and sends it to the frontend
exports.getUsers = async function (req, res) {
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
}

// Function updates the passwords in site data
exports.updateCredentials = async function (req, res) {
    const auth = req.headers['authorization'];
    const token = auth.split(' ')[1];

    try {
        const decoded = JWT.verify(token, 'JWT-Secret');

        const userLevel = decoded.level;
        const userDepartment = decoded.department;
        const userDivision = decoded.division;

        const requestedDepartment = req.params.department;
        const documentId = req.params.documentId;

        // Check if the user is accessing their own department
        if (userLevel === 'normal' && (userDepartment !== requestedDepartment)) {
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
}

// Function creates the passwords in site data
exports.createCredential = async function (req, res) {
    try {
        const auth = req.headers['authorization'];
        const token = auth.split(' ')[1];
        const decoded = JWT.verify(token, 'JWT-Secret');

        const department = req.params.department;

        const newData = req.body;

        // Choose the appropriate model based on the user's department
        let documentModel;
        switch (department) {
            case 'news_management':
                documentModel = NewsManagementModel;
                const newCredentialNM = new NewsManagementModel({
                    division: newData.division,
                    username: newData.username,
                    password: newData.password
                })
                await newCredentialNM.save();
                res.json({ message: 'success' })
                break;
            case 'software_reviews':
                documentModel = SoftwareReviewsModel;
                const newCredentialSR = new SoftwareReviewsModel({
                    division: newData.division,
                    username: newData.username,
                    password: newData.password
                })
                await newCredentialSR.save();
                res.json({ message: 'success' })
                break;
            case 'hardware_reviews':
                documentModel = HardwareReviewsModel;
                const newCredentialHR = new HardwareReviewsModel({
                    division: newData.division,
                    username: newData.username,
                    password: newData.password
                })
                await newCredentialHR.save();
                res.json({ message: 'success' })
                break;
            case 'opinion_publishing':
                documentModel = OpinionPublishingModel;
                const newCredentialOP = new OpinionPublishingModel({
                    division: newData.division,
                    username: newData.username,
                    password: newData.password
                })
                await newCredentialOP.save();
                res.json({ message: 'success' })
                break;
            default:
                return res.status(400).json({ error: 'Invalid department' });
        }


    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Function assigns and designes users from departments/divisions
exports.assignUser = async function (req, res){
    const auth = req.headers['authorization'];
    const token = auth.split(' ')[1];

    try {
        const decoded = JWT.verify(token, 'JWT-Secret');

        // Check if the user is an admin
        if (decoded.level !== 'admin') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        const userId = req.params.userId;
        const { department, division } = req.body;

        // Update the user's department and division
        await Users.findByIdAndUpdate(userId, { department, division });

        res.json({ message: 'User assigned successfully' });
    } catch (err) {
        res.status(401).send({ err: 'Bad JWT!' });
    }
}

// Function changes user roles
exports.changeUserRole = async function (req, res){
    const auth = req.headers['authorization'];
    const token = auth.split(' ')[1];

    try {
        const decoded = JWT.verify(token, 'JWT-Secret');

        // Check if the user is an admin
        if (decoded.level !== 'admin') {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        const userId = req.params.userId;
        const { newRole } = req.body;

        // Update the user's role
        await Users.findByIdAndUpdate(userId, { role: newRole });

        res.json({ message: 'User role changed successfully' });
    } catch (err) {
        res.status(401).send({ err: 'Bad JWT!' });
    }
}

// Function logs user into site
exports.loginUsers = async function (req, res){
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
}

// Function creates a new user
exports.registerUser = async function (req, res){
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
}

//Function verifys a user
exports.verifyToken = async function (req, res) {
    const auth = req.headers['authorization']
    const token = auth.split(' ')[1]

    try {
        const decoded = JWT.verify(token, 'JWT-Secret')
        res.send(decoded)
    }catch (err) {
        res.status(401).send({'err': 'Bad JWT!'})
    }
}