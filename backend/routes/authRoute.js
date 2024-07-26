const router = require("express").Router();
const { registerClientCtrl,verifyUserAccountCtrl,loginUserCtrl ,registergoogleClientCtrl,loginGoogleClientCtrl} = require("../controllers/authUserController");
 
router.post("/register", registerClientCtrl);
router.post("/google/register", registergoogleClientCtrl);

router.post("/login", loginUserCtrl);
router.post("/google/login", loginGoogleClientCtrl);

router.post("/:id/verify/:token", verifyUserAccountCtrl);




module.exports = router;