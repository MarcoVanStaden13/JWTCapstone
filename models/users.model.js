const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String },
    department: { type: String },
    division: { type: String },
});

const Users = mongoose.model('Users', userSchema);
module.exports = Users;