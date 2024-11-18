const mongoose = require('mongoose');
const {ObjectId}=mongoose.Schema.Types

// Define the UserSchema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address']
  },
  name: {
    type: String,          // Field type
    required: true,        // Mark as required
    trim: true,            // Automatically remove whitespace around the string
    minlength: 3,          // Minimum length validation
    maxlength: 50          // Maximum length validation
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long']
  },
  Photo:{
    type:String,
    
  },
  followers:[{type:ObjectId,ref:"User"}],
  following:[{type:ObjectId,ref:"User"}]
}, { timestamps: true });

// Export the User model
mongoose.model('User', UserSchema);


