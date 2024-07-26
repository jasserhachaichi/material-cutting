const mongoose = require("mongoose");
const { User } = require("./User");
const crypto = require("crypto");

// Define the token schema
const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1h" // Set token expiration time (1 hour in this case)
  }
});

// Static method to find a token by client ID
tokenSchema.statics.findByUserId = async function(userId) {
  return await this.findOne({ userId });
};

// Static method to create a token
tokenSchema.statics.createToken = async function(id) {
  const tokenValue = crypto.randomBytes(16).toString("hex");
  const token = new Token({ token: tokenValue, userId:id });
  await token.save();
  return token;
};

// Static method to delete a token by id
tokenSchema.statics.deleteToken = async function(id) {
  try {
    const result = await this.deleteOne({_id: id });
    console.log("Token deletion result:", result);
    return true
  } catch (error) {
    console.error("Error deleting token:", error);
    return false
  }
};



const Token = mongoose.model("Token", tokenSchema);

module.exports = { Token };
