const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shapeSchema = new Schema({
  avatarShapeImg: {
    type: String,  // Store file path
    required: true,
    default: null
  },
  avatarEdgeImg: {
    type: String,  // Store file path
    required: true,
    default: null
  },
  avatarAnglesImg: {
    type: String,  // Store file path 
    required: true,
    default: null
  },
  avatarDimensionsImg: {
    type: String,  // Store file path 
    required: true,
    default: null
  },
  status: {
    type: String,
    enum: ['available', 'not_available'],  // Enum for specific values
    default: 'available'
  },
  shapeName: {
    type: String,
    required: true
  },
  shapedescription: {
    type: String,
    required: false,
  },
  minA: {
    type: Number,
    min: 0,
    required: false
  },
  maxA: {
    type: Number,
    min: 0,
    required: false
  },
  minB: {
    type: Number,
    min: 0,
    required: false
  },
  maxB: {
    type: Number,
    min: 0,
    required: false
  },
  minC: {
    type: Number,
    min: 0,
    required: false
  },
  maxC: {
    type: Number,
    min: 0,
    required: false
  },
  price: {
    type: Number,  // Use Number instead of String for prices
    required: true
  },
  discountOption: {
    type: String,
    enum: ['1', '2', '3'],  // Options for discount types
    default: '1'
  },
  fixedDiscount: {
    type: Number,
    required: false
  },
  pourcentageDiscount: {
    type: Number,
    required: false
  },
  vatAmount: {
    type: Number,
    required: false,
    default:0
  },
  NB_Angle: {
    type: Number,
    required: false,
    default:0
  }
});




// Custom validation method
shapeSchema.methods.validateInputs = function() {
  // Remove fields with 0 or empty values
  for (const key in this._doc) {
    if (this[key] === 0 || this[key] === '') {
      delete this[key];
    }
  }
  if (this.NB_Angle < 0 ) {
    this.NB_Angle = 0;
  }

  // Validate discount options
  if (this.discountOption === '2' && (!this.pourcentageDiscount || this.pourcentageDiscount === 0)) {
    this.discountOption = '1';
  }

  if (this.discountOption === '3' && (!this.fixedDiscount || this.fixedDiscount === 0)) {
    this.discountOption = '1';
  }
};

// Pre-save hook to apply validation
shapeSchema.pre('save', function(next) {
  //console.log( "MongoDB This: "  + this);
  this.validateInputs();
  next();
});







const Shape = mongoose.model('Shape', shapeSchema);

module.exports = Shape;
