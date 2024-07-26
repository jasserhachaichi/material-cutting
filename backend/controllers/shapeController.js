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
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
    const skip = (page - 1) * limit;

    const shapes = await Shape.find({})
                              .skip(Number(skip))
                              .limit(Number(limit));

    const totalShapes = await Shape.countDocuments();

    return res.status(200).json({
      shapes,
      totalShapes,
      totalPages: Math.ceil(totalShapes / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error fetching shapes', error });
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
 * @desc    Get image of Shape
 * @route   /product/image/:filename
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
/*  const getShapesImg =(req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../uploads', filename); // Construct the file path

  res.sendFile(filePath, err => {
    if (err) {
      res.status(404).json({ message: 'Image not found' });
    }
  });
}; */


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
  try {
    const shapeId = req.params.id;
    const shape = await Shape.findById(shapeId);

    if (!shape) {
      return res.status(404).json({ message: 'Shape not found' });
    }

    // Delete associated images
    if (shape.avatarShapeImg) {
      const avatarShapePath = path.join(__dirname, '..', 'uploads', shape.avatarShapeImg);
      fs.unlink(avatarShapePath, err => {
        if (err) console.error(`Error deleting avatarShapeImg: ${err}`);
      });
    }

    if (shape.avatarEdgeImg) {
      const avatarEdgePath = path.join(__dirname, '..', 'uploads', shape.avatarEdgeImg);
      fs.unlink(avatarEdgePath, err => {
        if (err) console.error(`Error deleting avatarEdgeImg: ${err}`);
      });
    }
    if (shape.avatarAnglesImg) {
      const avatarAnglesImg = path.join(__dirname, '..', 'uploads', shape.avatarAnglesImg);
      fs.unlink(avatarAnglesImg, err => {
        if (err) console.error(`Error deleting avatarAnglesImg: ${err}`);
      });
    }

    if (shape.avatarDimensionsImg) {
      const avatarDimensionsImg = path.join(__dirname, '..', 'uploads', shape.avatarDimensionsImg);
      fs.unlink(avatarDimensionsImg, err => {
        if (err) console.error(`Error deleting avatarDimensionsImg: ${err}`);
      });
    }

    // Delete shape from database
    await shape.remove();

    return res.status(200).json({ message: 'Shape deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting shape', error });
  }
};

module.exports = { addShapeCtrl, deleteShapeCtrl,getShapesCtrl,getShapesWithPginationCtrl};
//module.exports = { addShapeCtrl, deleteShapeCtrl,getShapesCtrl,getShapesImg,getShapesWithPginationCtrl, upload };