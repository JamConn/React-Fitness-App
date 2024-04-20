const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  fitDataToken: String,
  profilePicture: { type: String },
  level: { type: Number, default: 0 }, 
  points: { type: Number, default: 0 },
  workouts: [
    {
      name: String,
      description: String,
      videoUrl: String,
      bodyPart: String,
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;