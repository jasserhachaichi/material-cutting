//const multer = require('multer');
const Shape = require("../models/Shape");
const fs = require('fs');
const path = require('path');

/* function getRandomNumber(maxLength) {
  const max = Math.pow(10, maxLength) - 1;
  return Math.floor(Math.random() * max);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomNum = getRandomNumber(7);
    cb(null, `${file.fieldname + '-' + randomNum + '-' + Date.now() + ext}`);
  }
});

const upload = multer({ storage }); */



/**-----------------------------------------------
 * @desc    Get All Shapes with pagination
 * @route   /product/shapes
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getShapesWithPginationCtrl = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const filterStatus = req.query.status || "";

  try {
    const query = {};

    if (search) {
      query.$or = [
        { shapeName: { $regex: search, $options: "i" } },
      ];
    }

    if (filterStatus) {
      query.status = filterStatus;
    }

    const shapes = await Shape.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Shape.countDocuments(query);

    return res.json({
      shapes,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shapes', error });
  }
};

/**-----------------------------------------------
 * @desc    Get All Shapes no pagination
 * @route   /product/order/shapes
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getShapesCtrl = async (req, res) => {
  try {
    const shapes = await Shape.find({});
    return res.status(200).json({
      shapes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error fetching shapes', error });
  }
};





/**-----------------------------------------------
 * @desc    Add New Shape
 * @route   /product/addshape
 * @method  POST
 * @access  private     
 ------------------------------------------------*/
 const addShapeCtrl = async (req, res) => {
  try {
    const formData = req.body;
    console.log(req.body);
    console.log(req.files);

    const avatarShape = req.files['avatarShape'] ? req.files['avatarShape'][0].filename : null;
    const avatarEdge = req.files['avatarEdge'] ? req.files['avatarEdge'][0].filename : null;
    const avatarAngles = req.files['avatarAngles'] ? req.files['avatarAngles'][0].filename : null;
    const avatarDimensions = req.files['avatarDimensions'] ? req.files['avatarDimensions'][0].filename : null;

    const newShape = new Shape({
      avatarShapeImg: avatarShape,
      avatarEdgeImg: avatarEdge,
      avatarAnglesImg:avatarAngles,
      avatarDimensionsImg:avatarDimensions,
      shapeName: formData.shape_name,
      shapedescription: formData.shapedescription,
      minA: formData.min_A,
      maxA: formData.max_A,
      minB: formData.min_B,
      maxB: formData.max_B,
      minC: formData.min_C,
      maxC: formData.max_C,
      price: formData.price,
      discountOption: formData.discount_option,
      fixedDiscount: formData.discounted_price,
      pourcentageDiscount: formData.discounted_percentage,
      vatAmount: formData.vat_amount,
      status: formData.status,
      NB_Angle:formData.NB_Angle
    });


    // Save the shape with custom validation
    await newShape.save();

    return res.status(200).json({ message: 'Shape added successfully!', newShape });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error adding shape', error });
  }
};

/**-----------------------------------------------
 * @desc    Delete Shape by ID
 * @route   /product/deleteshape/:id
 * @method  DELETE
 * @access  private     
 ------------------------------------------------*/
 const deleteShapeCtrl = async (req, res) => {
  const shapeId = req.params.id;
  
  try {
    const shape = await Shape.findById(shapeId);
    if (!shape) {
      return res.status(404).json({ message: "Shape not found", result: false });
    }

      // Check if shape has an image and remove it
      if (shape.avatarShapeImg) {
          const imagePath = path.join(__dirname, "..", "uploads", "shape", shape.avatarShapeImg);
          console.log(imagePath);
          if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
          }
          }
          if (shape.avatarEdgeImg) {
          const imagePath = path.join(__dirname, "..", "uploads", "shape", shape.avatarEdgeImg);
          console.log(imagePath);
          if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
          }
          }
          if (shape.avatarAnglesImg) {
          const imagePath = path.join(__dirname, "..", "uploads", "shape", shape.avatarAnglesImg);
          console.log(imagePath);
          if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
          }
          }
      
    if (shape.avatarDimensionsImg) {
      const imagePath = path.join(__dirname, "..", "uploads", "shape", shape.avatarDimensionsImg);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Shape.findByIdAndDelete(shapeId);

    return res.status(200).json({ message: "Shape deleted successfully", result: true });
  } catch (error) {
    console.error("Error deleting shape:", error);
    return res.status(500).json({ message: "Internal server error.", result: false });
  }
};

module.exports = { addShapeCtrl, deleteShapeCtrl,getShapesCtrl,getShapesWithPginationCtrl};
//module.exports = { addShapeCtrl, deleteShapeCtrl,getShapesCtrl,getShapesImg,getShapesWithPginationCtrl, upload };