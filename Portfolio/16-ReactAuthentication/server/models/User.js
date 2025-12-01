const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
UserSchema.pre('save', async function () {
    console.log('Pre-save hook triggered');
    if (!this.isModified('password')) {
        return;
    }

    try {
        console.log('Generating salt...');
        const salt = await bcrypt.genSalt(10);
        console.log('Hashing password...');
        this.password = await bcrypt.hash(this.password, salt);
        console.log('Password hashed');
    } catch (error) {
        console.error('Bcrypt error:', error);
        throw error;
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
