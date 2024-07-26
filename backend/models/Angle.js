const mongoose = require("mongoose");

const AngleSchema = new mongoose.Schema(
  {
    Angle_name: {
      type: String,
      required: true,
      unique: true
    },
    Angledescription: {
      type: String
    },
    border_radius: {
      type: [String],
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    discount_option: {
      type: Number,
      enum: [1, 2, 3],
      default: 1
    },
    discounted_percentage: {
      type: Number,
      default: 0
    },
    discounted_price: {
      type: Number,
      default: 0
    },
    vat_amount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["available", "not_available"],
      default: "available"
    },
    avatarAngle: {
      type: String, // Store file path
      required: true,
      default: null
    }
  },
  { timestamps: true }
);

// Custom validation method
AngleSchema.methods.validateInputs = function() {
  // Remove fields with 0 or empty values
  for (const key in this._doc) {
    if (this[key] === 0 || this[key] === "") {
      delete this[key];
    }
  }

  // Validate discount options
  if (
    this.discount_option === 2 &&
    (!this.discounted_percentage || this.discounted_percentage === 0)
  ) {
    this.discount_option = 1;
  }

  if (
    this.discount_option === 3 &&
    (!this.discounted_price || this.discounted_price === 0)
  ) {
    this.discount_option = 1;
  }
};


// Pre-save hook to apply validation
AngleSchema.pre("save", function(next) {
  this.validateInputs();
  next();
});

const Angle = mongoose.model("Angle", AngleSchema);

module.exports = Angle;
