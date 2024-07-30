const Edge = require("./../models/Edge");
const fs = require("fs");
const path = require("path");

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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const filterStatus = req.query.status || "";

  try {
    const query = {};

    if (search) {
      query.$or = [
        { Edge_name: { $regex: search, $options: "i" } },
      ];
    }

    if (filterStatus) {
      query.status = filterStatus;
    }

    const edges = await Edge.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Edge.countDocuments(query); // Use the same query for counting documents

    return res.json({
      edges,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching edges', error });
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



  /**-----------------------------------------------
 * @desc    Delete edge by ID
 * @route   /api/deletestaff/:id
 * @method  DELETE
 * @access  private
 ------------------------------------------------*/
 const deleteEdge = async (req, res) => {
  const edgeId = req.params.id;

  try {
    const edge = await Edge.findById(edgeId);
    if (!edge) {
      return res.status(404).json({ message: "Edge not found", result: false });
    }

    // Check if edge has an image and remove it
    if (edge.avatarEdge) {
      const imagePath = path.join(__dirname, "..", "uploads", "Edge", edge.avatarEdge);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Edge.findByIdAndDelete(edgeId);

    return res.status(200).json({ message: "Edge deleted successfully", result: true });
  } catch (error) {
    console.error("Error deleting edge:", error);
    return res.status(500).json({ message: "Internal server error.", result: false });
  }

};

module.exports = { AddEdgeCtrl , getEdgesWithPginationCtrl,getEdgesCtrl, deleteEdge};

