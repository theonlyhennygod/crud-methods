const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// pre-save hook to hash password before saving user to database
userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// comparePassword method to compare password input to password saved in database
const userSchema = new mongoose.Schema({
    // Other fields...
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number }
});

// pre-save hook to hash password before saving user to database
userSchema.methods.incLoginAttempts = function () {
    if (this.lockUntil && this.lockUntil > Date.now()) {
        return this.updateOne({ $inc: { loginAttempts: 1 } }).exec();
    }
    return this.updateOne({
        $set: { loginAttempts: 1 },
        $unset: { lockUntil: 1 }
    }).exec();
};



// comparePassword method to compare password input to password saved in database
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);