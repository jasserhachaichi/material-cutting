//const multer = require('multer');
const Angle = require("./../models/Angle");

// Preprocess border_radius field
function processBorderRadius(border_radius) {
  // Convert the string to an array of numbers
  let border_radiusArray = border_radius.split(",").map(Number);

  // Remove duplicate values
  border_radiusArray = [...new Set(border_radiusArray)];

  // Sort the array in ascending order
  border_radiusArray.sort((a, b) => a - b);

  return border_radiusArray;
}

/**-----------------------------------------------
 * @desc    Create new angle
 * @route   /product/addangle
 * @method  POST
 * @access  private     
 ------------------------------------------------*/
const AddAngleCtrl = async (req, res) => {
  const formData = req.body;
  console.log(req.body);
  console.log(req.files);
  const avatarAngle = req.file ? req.file.filename : null;
  try {
    const newAngle = new Angle({
      Angle_name: formData.angle_name,
      Angledescription: formData.angledescription,
      border_radius: processBorderRadius(formData.border_radius), // Array.isArray(formData.border_radius) ? formData.border_radius : [formData.border_radius],
      price: formData.price,
      discount_option: formData.discount_option,
      discounted_percentage: formData.discounted_percentage,
      discounted_price: formData.discounted_price,
      vat_amount: formData.vat_amount,
      status: formData.status,
      avatarAngle: avatarAngle
    });

    await newAngle.save();

    return res
      .status(201)
      .json({
        message: "Angle Added Successfully",
        Angle: newAngle
      });
  } catch (error) {
    console.error("Error adding angle:", error);
    return res
      .status(500)
      .json({ message: "There was an error adding the angle!" });
  }
};

/**-----------------------------------------------
 * @desc    Get All Angles with pagination
 * @route   /product/angles
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getAnglesWithPginationCtrl = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
      const skip = (page - 1) * limit;
  
      const angles = await Angle.find({})
                                .skip(Number(skip))
                                .limit(Number(limit));
  
      const totalAngles = await Angle.countDocuments();
  
      return res.status(200).json({
        angles,
        totalAngles,
        totalPages: Math.ceil(totalAngles / limit),
        currentPage: Number(page)
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error fetching angles', error });
    }
  };

/**-----------------------------------------------
 * @desc    Get All Angles no pagination
 * @route   /product/order/angles
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getAnglesCtrl = async (req, res) => {
    try {
      const angles = await Angle.find({});
      return res.status(200).json({
        angles,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error fetching angles', error });
    }
  };

module.exports = { AddAngleCtrl , getAnglesWithPginationCtrl,getAnglesCtrl};

