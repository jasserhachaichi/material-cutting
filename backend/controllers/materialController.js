//const multer = require('multer');
const Material = require("../models/Material");
//const path = require("path");

/* function getRandomNumber(maxLength) {
    const max = Math.pow(10, maxLength) - 1;
    return Math.floor(Math.random() * max);
}
  
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/Material/');
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const randomNum = getRandomNumber(7);
      cb(null, `${file.fieldname + '-' + randomNum + '-' + Date.now() + ext}`);
    }
});
  
const uploadMT = multer({ storage }); */

// Preprocess thickness field
function processThickness(thickness) {
  // Convert the string to an array of numbers
  let thicknessArray = thickness.split(",").map(Number);

  // Remove duplicate values
  thicknessArray = [...new Set(thicknessArray)];

  // Sort the array in ascending order
  thicknessArray.sort((a, b) => a - b);

  return thicknessArray;
}

/**-----------------------------------------------
 * @desc    Create new material
 * @route   /product/addmaterial
 * @method  POST
 * @access  private     
 ------------------------------------------------*/
const AddMaterialCtrl = async (req, res) => {
  const formData = req.body;
  console.log(req.body);
  console.log(req.files);
  const avatarMaterial = req.file ? req.file.filename : null;
  try {
    const newMaterial = new Material({
      material_name: formData.material_name,
      materialdescription: formData.materialdescription,
      thickness: processThickness(formData.thickness), // Array.isArray(formData.thickness) ? formData.thickness : [formData.thickness],
      price: formData.price,
      discount_option: formData.discount_option,
      discounted_percentage: formData.discounted_percentage,
      discounted_price: formData.discounted_price,
      vat_amount: formData.vat_amount,
      status: formData.status,
      material: formData.material,
      avatarMaterial: avatarMaterial,
      materialType: formData.materialtype
    });

    await newMaterial.save();

    return res
      .status(201)
      .json({
        message: "Material Added Successfully",
        material: newMaterial
      });
  } catch (error) {
    console.error("Error adding material:", error);
    return res
      .status(500)
      .json({ message: "There was an error adding the material!" });
  }
};

/**-----------------------------------------------
 * @desc    Get All Materials with pagination
 * @route   /product/materials
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getMaterialsWithPginationCtrl = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
      const skip = (page - 1) * limit;
  
      const materials = await Material.find({})
                                .skip(Number(skip))
                                .limit(Number(limit));
  
      const totalMaterials = await Material.countDocuments();
  
      return res.status(200).json({
        materials,
        totalMaterials,
        totalPages: Math.ceil(totalMaterials / limit),
        currentPage: Number(page)
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error fetching materials', error });
    }
  };

/**-----------------------------------------------
 * @desc    Get All Materials no pagination
 * @route   /product/order/materials
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getMaterialsCtrl = async (req, res) => {
    try {
      //const materials = await Material.find({});
      const materials = await Material.find({}).sort({ material: 1 });
      return res.status(200).json({
        materials,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error fetching materials', error });
    }
  };

























module.exports = { AddMaterialCtrl , getMaterialsWithPginationCtrl,getMaterialsCtrl};
//module.exports = { uploadMT ,AddMaterialCtrl};
