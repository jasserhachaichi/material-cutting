const MaterialType = require("../models/MaterialType");


/**-----------------------------------------------
 * @desc    Create new material type
 * @route   /product/addmaterialtype
 * @method  POST
 * @access  private     
 ------------------------------------------------*/
const AddMaterialTypeCtrl = async (req, res) => {
  const formData = req.body;
  console.log(req.body);
  console.log(req.files);
  const avatarMaterialType = req.file ? req.file.filename : null;
  try {
    const newMaterialType = new MaterialType({
      materialType_name: formData.materialType_name,
      materialTypedescription: formData.materialTypedescription,
      material: formData.material,
      avatarMaterialType: avatarMaterialType
    });

    await newMaterialType.save();

    return res
      .status(201)
      .json({
        message: "Material Type Added Successfully",
        material: newMaterialType
      });
  } catch (error) {
    console.error("Error adding material type:", error);
    return res
      .status(500)
      .json({ message: "There was an error adding the material type!" });
  }
};

/**-----------------------------------------------
 * @desc    Get All Material Types with pagination
 * @route   /product/materialtypes
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
/*  const getMaterialTypesWithPginationCtrl = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
      const skip = (page - 1) * limit;
  
      const materialtypes = await MaterialType.find({})
                                .skip(Number(skip))
                                .limit(Number(limit));
  
      const totalMaterials = await Material.countDocuments();
  
      return res.status(200).json({
        materialtypes,
        totalMaterials,
        totalPages: Math.ceil(totalMaterials / limit),
        currentPage: Number(page)
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error fetching material types', error });
    }
  }; */

/**-----------------------------------------------
 * @desc    Get All Materials no pagination
 * @route   /product/order/materials
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getMaterialTypesCtrl = async (req, res) => {
    try {
      const materialtypes = await MaterialType.find({});
      return res.status(200).json({
        materialtypes,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error fetching material types', error });
    }
  };

























module.exports = { AddMaterialTypeCtrl,getMaterialTypesCtrl};

