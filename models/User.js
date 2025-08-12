const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        firstName: {type: String},
        familyName: {type: String},
        phone: {type: String},
        address: {type: String},
        zip: {type: String},
        town: {type: String},
        country: {type: String},
        role: {type: String, enum: ['user', 'admin'], default: 'user'},
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;