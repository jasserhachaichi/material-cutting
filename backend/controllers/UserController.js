const {User} = require("./../models/User");

/**-----------------------------------------------
 * @desc    Get all clients
 * @route   /api/clients
 * @method  GET
 * @access  private    
 ------------------------------------------------*/
module.exports.allclients = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 1;

  try {
    const users = await User.find()
      .sort({ joinedDate: -1 }) // Optional: Sort by joined date
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const count = await User.countDocuments();
    console.log(users);
    
    return res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }


};
