const router = require("express").Router();
const {allclients} = require("../controllers/UserController.js");
 
router.get("/clients", allclients);



module.exports = router;