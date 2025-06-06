const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned'],
    default: 'active'
  },
  isVerified: { type: Boolean, default: false }, // To track if the email is verified
  verificationCode: { type: String }, // Stores the verification code
  verificationCodeExpires: { type: Date }, // Stores the expiration time of the code
},
  {
    timestamps: true, // Add this to automatically create createdAt and updatedAt fields
    // Password reset fields 
    resetPasswordCode: { type: String },       // Stores the 6-digit reset code
    resetPasswordExpires: { type: Date },     // Expiration time (10 minutes)
  });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);