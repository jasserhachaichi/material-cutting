const router = require("express").Router();
const {updatecountry,updatetown,updatepostcode,updatestate,updatephone, updateaddress1,updateaddress2, allclients,allstaffs,addstaff, deletestaff, getuser,updateEmail,updatePassword, updateRole,updateDetails, updateFname, updateLname} = require("../controllers/UserController.js");
const createMulterConfig = require('./../config/multerConfig');
const getImg = require("./../utils/getImage");



router.get("/clients", allclients);
router.get("/staffs", allstaffs);
const uploadP = createMulterConfig('uploads/ProfilesIMG/');
// Route to get image by name
router.get('/image/profile/:filename', (req, res) => getImg(req, res, "uploads/ProfilesIMG"));
router.post("/adduser", uploadP.single('avatar'),addstaff);
// Route to delete a user by ID
router.delete("/deletestaff/:id", deletestaff);

// Route to get and update user details by ID
router.get("/user/:id", getuser);
router.put('/user/:id/password', updatePassword);
router.put("/user/:id/email", updateEmail);
router.put("/user/:userId/role", updateRole);
router.put("/user/:id/firstname", updateFname);
router.put("/user/:id/lastname", updateLname);
router.put("/user/img/:id", uploadP.single('avatar'),updateDetails);

router.put("/user/:id/address1", updateaddress1);
router.put("/user/:id/address2", updateaddress2);
router.put("/user/:id/phone", updatephone);
router.put("/user/:id/town", updatetown);
router.put("/user/:id/state", updatestate);
router.put("/user/:id/postcode", updatepostcode);
router.put("/user/:id/country", updatecountry);


// Route to get and update user details by ID
router.get("/client/:id", getuser);
/* router.put('/client/:id/password', updatePassword);
router.put("/client/:id/email", updateEmail);
router.put("/client/:userId/role", updateRole);
router.put("/client/:id/firstname", updateFname);
router.put("/client/:id/lastname", updateLname);
router.put("/client/img/:id", uploadP.single('avatar'),updateDetails); */




module.exports = router;