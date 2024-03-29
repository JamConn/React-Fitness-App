const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  fitDataToken: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;