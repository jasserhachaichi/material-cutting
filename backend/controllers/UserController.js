const path = require("path");
const bcrypt = require("bcrypt");
const transporter = require("../config/nodemailer");
const { generateToken } = require("../config/jwt-utils");
const {
  User,
  validateRegisterUser,
  validateLoginUser
} = require("../models/User");

const fs = require("fs");
const ejs = require("ejs");

const { Token } = require("../models/Token");


async function findTokenForUser(userId) {
  const token = await Token.findByUserId(userId);
  return token;
}


/**-----------------------------------------------
 * @desc    Get all clients
 * @route   /api/clients
 * @method  GET
 * @access  private    
 ------------------------------------------------*/
 module.exports.allclients = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";


  try {
    const query = {
      role: { $eq: "client" }
    };

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }


    let users = await User.find(query)
      .sort({ joinedDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await User.countDocuments(query);

    // Add base URL to image field if not empty
    const baseURL = "http://localhost:4000/api/image/profile/";
    users = users.map(user => {
      if (user.image) {
        user.image = `${baseURL}${user.image}`;
      }
      return user;
    });

    return res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};



/**-----------------------------------------------
 * @desc    Get all staffs
 * @route   /api/staffs
 * @method  GET
 * @access  private    
 ------------------------------------------------*/
/*   module.exports.allstaffs = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 1;

  try {
    const users = await User.find({ })//role: { $ne: "client" }
      .sort({ joinedDate: -1 }) // Optional: Sort by joined date
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const count = await User.countDocuments();//{role: { $ne: "client" }}
    //console.log(users);
    
    return res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};  */


 module.exports.allstaffs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const filterRole = req.query.role || "";

  try {
    const query = {
       role: { $ne: "client" }
    };

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    if (filterRole) {
      query.role = filterRole;
    }

    let users = await User.find(query)
      .sort({ joinedDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await User.countDocuments(query);

    // Add base URL to image field if not empty
    const baseURL = "http://localhost:4000/api/image/profile/";
    users = users.map(user => {
      if (user.image) {
        user.image = `${baseURL}${user.image}`;
      }
      return user;
    });

    return res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};




/**-----------------------------------------------
 * @desc    Add new user
 * @route   /api/adduser
 * @method  POST
 * @access  private    
 ------------------------------------------------*/
 module.exports.addstaff = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
   const avatar = req.file ? req.file.filename : null;

  var userData = req.body;
  userData.image =  avatar || null ;
  const pwd = req.body.password;

  try {
    const validationResult = await validateRegisterUser(userData);

    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.message);
      return res
        .status(200)
        .json({ message: validationResult.message, result: false }); //400
    }

    // Validation passed, proceed with user registration
    var newUser = new User(userData);
    // Encrypt the password
    const saltRounds = 10;
    newUser.password = await bcrypt.hash(pwd, saltRounds);

    await newUser.save();
    const newToken = await Token.createToken(newUser._id);

    console.log("User data is valid and registered successfully.");

    const currentYear = new Date().getFullYear();
    const baseYear = 2024;
    const yearText =
      currentYear === baseYear ? baseYear : `${baseYear}-${currentYear}`;
    const firstName = newUser.firstName;

    // Making the link
    const activationLink = `${process.env.CLIENT_DOMAIN}/auth/${newUser._id}/verify/${newToken.token}`;

    const emailvar = { yearText, firstName, activationLink };

    const img1 = path.join(__dirname, "../Emailmodels/logos/logo-compact.png");

    const templatePath = path.join(__dirname, "../Emailmodels/newuser.ejs");

    fs.readFile(templatePath, "utf8", (error, template) => {
      if (error) {
        //return res.render("error", { error });
        return res.status(200).json({ message: error, result: false }); //400
      }

      try {
        // Render the template with the variables
        const htmlContent = ejs.render(template, emailvar); // emailvar
        //console.log(htmlContent);

        const mailOptions = {
          from: process.env.sendermail,
          to: newUser.email,
          subject: "Welcome to our new User",
          html: htmlContent,
          attachments: [
            {
              filename: "image1.png",
              path: img1,
              cid: "unique@image.1"
            }
          ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return res.status(200).json({ message: error, result: false });
          } else {
            console.log("Email sent: " + info.response);
            return res.status(200).json({
              message:
                "Your account created successfully and we send to you email to activate your account",
              result: true,
              email: newUser.email,
              id: newUser._id
            }); //201
          }
        });
      } catch (error) {
        console.error(error);
        return res
          .status(200)
          .json({ message: "Error sending email", result: false }); //500
      }
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(200)
      .json({ message: "Internal server error.", result: false }); //500
  } 

      return res.status(200).json({
        message:
          "Your account created successfully and we send to you email to activate your account",
        result: true,
      }); //201



};




/**-----------------------------------------------
 * @desc    Delete user by ID
 * @route   /api/deletestaff/:id
 * @method  DELETE
 * @access  private
 ------------------------------------------------*/
 module.exports.deletestaff = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", result: false });
    }

    // Check if user has an image and remove it
    if (user.image) {
      const imagePath = path.join(__dirname, "..", "uploads", "ProfilesIMG", user.image);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "User deleted successfully", result: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error.", result: false });
  }
};


/**-----------------------------------------------
 * @desc    Get user information by ID
 * @route   /api/user/:id
 * @method  GET
 * @access  private
 ------------------------------------------------*/
 module.exports.getuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const baseURL = "http://localhost:4000/api/image/profile/";

      if (user.image) {
        user.image = baseURL + user.image;
      }

      //console.log("ggg"+user);
      return res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




/**-----------------------------------------------
 * @desc    Update user email by ID
 * @route   /api/user/:id/email
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 module.exports.updateEmail = async (req, res) => {
  console.log( req.params);
  const  id  =  req.params.id;
  const { email } = req.body;
  console.log("hh" + id)

  // Validate new email
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  // Check if the new email already exists in the database
  const emailExists = await User.emailExists(email);
  if (emailExists) {
    return res.status(400).json({ message: 'This email address is already registered.' });
  }
  const userdata = await User.findById(id);

  try {
    const user = await User.findByIdAndUpdate(id, { email }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } 

      const oldemail = userdata.email ;
      const newemail = user.email ;


    const currentYear = new Date().getFullYear();
    const baseYear = 2024;
    const yearText = currentYear === baseYear ? baseYear : `${baseYear}-${currentYear}`;
    const firstName = userdata.firstName;
    const emailvar = { yearText, firstName,oldemail, newemail};
    const img1 = path.join(__dirname, "../Emailmodels/logos/logo-compact.png");
    const templatePath = path.join(__dirname, "../Emailmodels/email-change.ejs");


    fs.readFile(templatePath, "utf8", (error, template) => {
      if (error) {
        //return res.render("error", { error });
        return res.status(200).json({ message: error}); //400
      }

      try {
        // Render the template with the variables
        const htmlContent = ejs.render(template, emailvar); // emailvar
        const mailOptions = {
          from: process.env.sendermail,
          to: [newemail,oldemail],
          subject: "Your email updated",
          html: htmlContent,
          attachments: [
            {
              filename: "image1.png",
              path: img1,
              cid: "unique@image.1"
            }
          ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return res.status(200).json({ message: error, result: false });
          } else {
            console.log("Email sent: " + info.response);
            return res.status(200).json({
              message:
                "This email updated",
            }); //201
          }
        });
      } catch (error) {
        console.error(error);
        return res
          .status(200)
          .json({ message: "Error sending email"}); //500
      }
    });


   //return res.status(200).json({ message: 'This email updated.' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



/**-----------------------------------------------
 * @desc    Update user password by ID
 * @route   /api/user/:id/password
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
module.exports.updatePassword = async (req, res) => {
  const { id } = req.params;
  const { current_password, new_password, confirm_password } = req.body;
  //console.log(current_password);

   if (!new_password || !confirm_password || new_password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match' });
  }

  if (!new_password || !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*?&])[A-Za-z\d@!%*?&]{8,}$/.test(new_password)) {
      return res.status(400).json({ message: 'New password does not meet complexity requirements' });
  } 

  try {
      const user = await User.findById(id);
      //console.log(user);
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      const isMatch = await bcrypt.compare(current_password, user.password);
       if (!isMatch) {
          return res.status(400).json({ message: 'Current password is incorrect.' });
      } 

      const saltRounds = 10;
      user.password = await bcrypt.hash(new_password, saltRounds);
      await user.save();

      const currentYear = new Date().getFullYear();
      const baseYear = 2024;
      const yearText = currentYear === baseYear ? baseYear : `${baseYear}-${currentYear}`;
      const emailVars = { yearText, firstName: user.firstName };
      const img1 = path.join(__dirname, "../Emailmodels/logos/logo-compact.png");
      const templatePath = path.join(__dirname, "../Emailmodels/password-change.ejs");

      fs.readFile(templatePath, "utf8", (error, template) => {
          if (error) {
              return res.status(500).json({ message: 'Error reading email template' });
          }

          try {
              const htmlContent = ejs.render(template, emailVars);
              const mailOptions = {
                  from: process.env.SENDER_EMAIL,
                  to: user.email,
                  subject: "Your password has been changed",
                  html: htmlContent,
                  attachments: [{
                      filename: "logo-compact.png",
                      path: img1,
                      cid: "unique@image.1"
                  }]
              };

              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      return res.status(500).json({ message: 'Error sending email' });
                  }
                  return res.status(200).json({ message: 'Password updated successfully.' });
              });
          } catch (error) {
              return res.status(500).json({ message: 'Error rendering email template' });
          }
      });
  } catch (error) {
      console.error('Error updating password:', error);
      return res.status(500).json({ message: 'Internal server error.' });
  }
};


/**-----------------------------------------------
 * @desc    Update user role by ID
 * @route   /api/user/:userId/role
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 module.exports.updateRole = async (req, res) => {
  console.log(req.params);
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Find the user by ID and update their role
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: 'Server error', error });
  }
};


/**-----------------------------------------------
 * @desc    Update user image profil by ID
 * @route   /api/user/img/:id
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 module.exports.updateDetails = async (req, res) => {


  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;
    const avatar = req.file ? req.file.filename : null;

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
/*     if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName; */

    // Check if user has an image and remove it
    if (user.image) {
      const imagePath = path.join(__dirname, "..", "uploads", "ProfilesIMG", user.image);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    if(user.imageUrl){
      user.imageUrl = null;
    }

    if (avatar){
      user.image = avatar;
    }else{
      user.image = null;
    }



    // Save updated user
    await user.save();

    if(user.image != null){
      user.image= "http://localhost:4000/api/image/profile/" + user.image;
    }else{
      user.image= '/assets/images/Default-profile.jpg';
    }




    return res.status(200).json({
      message: 'User details updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: 'Error updating user details' });
  }

  
};

/**-----------------------------------------------
 * @desc    Update user first name by ID
 * @route  /api/user/:id/firstname
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 module.exports.updateFname = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = firstName;
    await user.save();

    if(user.image != null){
      user.image= "http://localhost:4000/api/image/profile/" + user.image;
    }else{
      if(user.imageUrl != null){
        user.image=user.imageUrl;
      }else{
        user.image= '/assets/images/Default-profile.jpg';
      }
      
    }

    return res.status(200).json({ message: 'First name updated successfully', user });
  } catch (error) {
    console.error('Error updating first name:', error);
    return res.status(500).json({ message: 'Error updating first name' });
  }

 };

 /**-----------------------------------------------
 * @desc    Update user first name by ID
 * @route  /api/user/:id/lastname
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 module.exports.updateLname = async (req, res) => {
  try {
    const { id } = req.params;
    const { lastName } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.lastName = lastName;
    await user.save();
    if(user.image != null){
      user.image= "http://localhost:4000/api/image/profile/" + user.image;
    }else{
      if(user.imageUrl != null){
        user.image=user.imageUrl;
      }else{
        user.image= '/assets/images/Default-profile.jpg';
      }
      
    }

    return res.status(200).json({ message: 'Last name updated successfully', user });
  } catch (error) {
    console.error('Error updating last name:', error);
    return res.status(500).json({ message: 'Error updating last name' });
  }

 };



  /**-----------------------------------------------
 * @desc    Update user address1 by ID
 * @route  /api/user/:id/address1
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 module.exports.updateaddress1 = async (req, res) => {
  try {
    const { id } = req.params;
    const { address1 } = req.body;

    console.log(address1);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.addr1 = address1;
    await user.save();
    if(user.image != null){
      user.image= "http://localhost:4000/api/image/profile/" + user.image;
    }else{
      if(user.imageUrl != null){
        user.image=user.imageUrl;
      }else{
        user.image= '/assets/images/Default-profile.jpg';
      }
      
    }

    return res.status(200).json({ message: 'address1 updated successfully.', user });
  } catch (error) {
    console.error('Error updating address1:', error);
    return res.status(500).json({ message: 'Error updating address1.' });
  }

 };

   /**-----------------------------------------------
 * @desc    Update user address2 by ID
 * @route  /api/user/:id/address2
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 module.exports.updateaddress2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { address2 } = req.body;

    console.log(address2);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.addr2 = address2;
    await user.save();
    if(user.image != null){
      user.image= "http://localhost:4000/api/image/profile/" + user.image;
    }else{
      if(user.imageUrl != null){
        user.image=user.imageUrl;
      }else{
        user.image= '/assets/images/Default-profile.jpg';
      }
      
    }

    return res.status(200).json({ message: 'address2 updated successfully.', user });
  } catch (error) {
    console.error('Error updating address2:', error);
    return res.status(500).json({ message: 'Error updating address2.' });
  }

 };

    /**-----------------------------------------------
 * @desc    Update user phone by ID
 * @route  /api/user/:id/phone
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 module.exports.updatephone = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone } = req.body;

    if(phone < 0){
      return res.status(500).json({ message: 'Phone must be positive' });
    }

    console.log(phone);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.phone = phone;
    await user.save();
    if(user.image != null){
      user.image= "http://localhost:4000/api/image/profile/" + user.image;
    }else{
      if(user.imageUrl != null){
        user.image=user.imageUrl;
      }else{
        user.image= '/assets/images/Default-profile.jpg';
      }
      
    }

    return res.status(200).json({ message: 'Phone updated successfully.', user });
  } catch (error) {
    console.error('Error updating phone:', error);
    return res.status(500).json({ message: 'Error updating phone.' });
  }

 };
    /**-----------------------------------------------
 * @desc    Update user town by ID
 * @route  /api/user/:id/town
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 module.exports.updatetown = async (req, res) => {
  try {
    const { id } = req.params;
    const { town } = req.body;

    console.log(town);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.town = town;
    await user.save();
    if(user.image != null){
      user.image= "http://localhost:4000/api/image/profile/" + user.image;
    }else{
      if(user.imageUrl != null){
        user.image=user.imageUrl;
      }else{
        user.image= '/assets/images/Default-profile.jpg';
      }
      
    }

    return res.status(200).json({ message: 'Town updated successfully.', user });
  } catch (error) {
    console.error('Error updating town:', error);
    return res.status(500).json({ message: 'Error updating town.' });
  }

 };


    /**-----------------------------------------------
 * @desc    Update user state by ID
 * @route  /api/user/:id/state
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 module.exports.updatestate = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    console.log(state);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.sp = state;
    await user.save();
    if(user.image != null){
      user.image= "http://localhost:4000/api/image/profile/" + user.image;
    }else{
      if(user.imageUrl != null){
        user.image=user.imageUrl;
      }else{
        user.image= '/assets/images/Default-profile.jpg';
      }
      
    }

    return res.status(200).json({ message: 'State updated successfully.', user });
  } catch (error) {
    console.error('Error updating state:', error);
    return res.status(500).json({ message: 'Error updating state.' });
  }

 };



    /**-----------------------------------------------
 * @desc    Update user postcode by ID
 * @route  /api/user/:id/postcode
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 module.exports.updatepostcode = async (req, res) => {
  try {
    const { id } = req.params;
    const { postcode } = req.body;

    if(postcode < 0){
      return res.status(500).json({ message: 'Post code must be positive' });
    }


    console.log(postcode);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.postCode = postcode;
    await user.save();
    if(user.image != null){
      user.image= "http://localhost:4000/api/image/profile/" + user.image;
    }else{
      if(user.imageUrl != null){
        user.image=user.imageUrl;
      }else{
        user.image= '/assets/images/Default-profile.jpg';
      }
      
    }

    return res.status(200).json({ message: 'Post code updated successfully.', user });
  } catch (error) {
    console.error('Error updating post code:', error);
    return res.status(500).json({ message: 'Error updating post code.' });
  }

 };

    /**-----------------------------------------------
 * @desc    Update user country by ID
 * @route  /api/user/:id/country
 * @method  PUT
 * @access  private
 ------------------------------------------------*/
 module.exports.updatecountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { country } = req.body;

    console.log(country);

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.country = country;
    await user.save();
    if(user.image != null){
      user.image= "http://localhost:4000/api/image/profile/" + user.image;
    }else{
      if(user.imageUrl != null){
        user.image=user.imageUrl;
      }else{
        user.image= '/assets/images/Default-profile.jpg';
      }
      
    }

    return res.status(200).json({ message: 'Country updated successfully.', user });
  } catch (error) {
    console.error('Error updating country:', error);
    return res.status(500).json({ message: 'Error updating country.' });
  }

 };