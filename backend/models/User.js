const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  joinedDate: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  verification: {
    type: Boolean,
    required: false,
    default: false,
  },
  TwoStep: {
    type: Boolean,
    required: false,
    default: false,
  },
  login: {
    type: Date,
    required: false,
    default: Date.now,
  },
  addr1: {
    type: String,
    required: false,
  },
  addr2: {
    type: String,
    required: false,
  },
  town: {
    type: String,
    required: false,
  },
  sp: {
    type: String,
    required: false,
  },
  postCode: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "client"
  },
});

// Static method to find a user by email
userSchema.statics.findByEmail = async function(email) {
  const user = await this.findOne({ email });
  return user;
};

// Static method to verify if a user exists by email
userSchema.statics.emailExists = async function(email) {
  const count = await this.countDocuments({ email });
  return count > 0;
};

// Static method to update verification status
userSchema.statics.updateVerificationStatus = async function(userId) {
  await this.findByIdAndUpdate(userId, { verification: true });
};


async function validateRegisterUser(userData) {
    const { firstName, lastName, email, password,confirmPassword } = userData;

    // Check if password and confirmPassword are match
    if (!password || !confirmPassword || password.trim() != confirmPassword.trim()) {
      return { success: false, message: 'Passwords do not match.' };
    }

    // Check if firstName is provided and meets length requirements
    if (!firstName || firstName.trim().length < 2 || firstName.trim().length > 100) {
      return { success: false, message: 'First name must be between 2 and 100 characters.' };
    }
  
    // Check if lastName is provided and meets length requirements
    if (!lastName || lastName.trim().length < 2 || lastName.trim().length > 100) {
      return { success: false, message: 'Last name must be between 2 and 100 characters.' };
    }
  
    // Check if email is provided and validate format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }
  
    // Check if email already exists in the database
    const emailExists = await User.emailExists(email);
    if (emailExists) {
      return { success: false, message: 'This email address is already registered.' };
    }
  
    // Check if password meets complexity requirements
    if (!password || !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*?&])[A-Za-z\d@!%*?&]{8,}$/.test(password)) {
      return {
        success: false,
        message: 'Password must be at least 8 characters with a combination of letters, digits, and special characters except $.',
      };
    };
    
  
    // If all validations pass, return success
    return { success: true };
  }



  async function validateLoginUser(userData) {
    const {email, password } = userData;
    //console.log(email  + " ---- " + password)

    // Check if email is provided and validate format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return { success: false, message: 'Please type a valid email address.' };
    }
  
    // Check if email already exists in the database
    const emailExists = await User.emailExists(email);
    if (!emailExists) {
      return { success: false, message: 'This email address is not exist.' };
    }
  
    // Check if password meets complexity requirements
    if (!password || !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*?&])[A-Za-z\d@!%*?&]{8,}$/.test(password)) {
      return {
        success: false,
        message: 'Password must be at least 8 characters with a combination of letters, digits, and special characters except $.',
      };
    };
    
    // If all validations pass, return success
    return { success: true };
  }

const User = mongoose.model('User', userSchema);

module.exports = {User,validateRegisterUser,validateLoginUser};
