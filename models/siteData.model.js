const mongoose = require('mongoose');

const siteDataSchema = new mongoose.Schema({
    division: { type: String},
    username: { type: String, required: true},
    password: { type: String, required: true}
});

module.exports = siteDataSchema;