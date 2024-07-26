const mongoose = require("mongoose");

const MaterialTypeSchema = new mongoose.Schema(
  {
    materialType_name: {
      type: String,
      required: true,
      unique: true
    },
    materialTypedescription: {
      type: String
    },
    material: {
      type: String,
      enum: ["metal", "wood", "plastic", "glass-mirror"],
      default: "metal"
    },
    avatarMaterialType: {
      type: String, // Store file path
      required: true,
      default: null
    }
  },
  { timestamps: true }
);

// Custom validation method
MaterialTypeSchema.methods.validateInputs = function() {
  // Remove fields with 0 or empty values
  for (const key in this._doc) {
    if (this[key] === 0 || this[key] === "") {
      delete this[key];
    }
  }

};


// Pre-save hook to apply validation
MaterialTypeSchema.pre("save", function(next) {
  this.validateInputs();
  next();
});

const MaterialType = mongoose.model("MaterialType", MaterialTypeSchema);

module.exports = MaterialType;
