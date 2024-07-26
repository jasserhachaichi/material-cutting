//const multer = require('multer');
const Edge = require("./../models/Edge");

/**-----------------------------------------------
 * @desc    Create new edge
 * @route   /product/addedge
 * @method  POST
 * @access  private     
 ------------------------------------------------*/
const AddEdgeCtrl = async (req, res) => {
  const formData = req.body;
  console.log(req.body);
  console.log(req.files);
  const avatarEdge = req.file ? req.file.filename : null;
  try {
    const newEdge = new Edge({
      Edge_name: formData.edge_name,
      Edgedescription: formData.edgedescription,
      price: formData.price,
      discount_option: formData.discount_option,
      discounted_percentage: formData.discounted_percentage,
      discounted_price: formData.discounted_price,
      vat_amount: formData.vat_amount,
      status: formData.status,
      avatarEdge: avatarEdge
    });

    await newEdge.save();

    return res
      .status(201)
      .json({
        message: "Material Type Added Successfully",
        Edge: newEdge
      });
  } catch (error) {
    console.error("Error adding edge:", error);
    return res
      .status(500)
      .json({ message: "There was an error adding the edge!" });
  }
};

/**-----------------------------------------------
 * @desc    Get All Edges with pagination
 * @route   /product/edges
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getEdgesWithPginationCtrl = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
      const skip = (page - 1) * limit;
  
      const edges = await Edge.find({})
                                .skip(Number(skip))
                                .limit(Number(limit));
  
      const totalEdges = await Edge.countDocuments();
  
      return res.status(200).json({
        edges,
        totalEdges,
        totalPages: Math.ceil(totalEdges / limit),
        currentPage: Number(page)
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error fetching material types', error });
    }
  };

/**-----------------------------------------------
 * @desc    Get All Edges no pagination
 * @route   /product/order/edges
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const getEdgesCtrl = async (req, res) => {
    try {
      const edges = await Edge.find({});
      return res.status(200).json({
        edges,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error fetching edges', error });
    }
  };

module.exports = { AddEdgeCtrl , getEdgesWithPginationCtrl,getEdgesCtrl};

