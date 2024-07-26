const router = require("express").Router();
const createMulterConfig = require('./../config/multerConfig');
const getImg = require("./../utils/getImage");


//shape
const upload = createMulterConfig('uploads/shape/');
//const { addShapeCtrl, deleteShapeCtrl, getShapesCtrl,getShapesImg,getShapesWithPginationCtrl, upload } = require('../controllers/shapeController');
const { addShapeCtrl, deleteShapeCtrl, getShapesCtrl,getShapesWithPginationCtrl} = require('../controllers/shapeController');
// Route to get image by name
router.get('/image/shape/:filename', (req, res) => getImg(req, res, "uploads/shape")); //getShapesImg
//route to get all shapes
router.get('/shapes', getShapesWithPginationCtrl);
router.get('/order/shapes', getShapesCtrl);
router.post('/addshape', upload.fields([{ name: 'avatarShape' }, { name: 'avatarEdge' }, { name: 'avatarAngles' }, { name: 'avatarDimensions' }]), addShapeCtrl);
router.delete('/deleteshape/:id', deleteShapeCtrl);



//material
const {AddMaterialCtrl,getMaterialsWithPginationCtrl,getMaterialsCtrl} = require("../controllers/materialController");
const uploadM = createMulterConfig('uploads/Material/');
// Route to get image by name
router.get('/image/material/:filename', (req, res) => getImg(req, res, "uploads/Material"));
router.post("/addmaterial", uploadM.single('avatarMaterial'),AddMaterialCtrl);
router.get('/materials', getMaterialsWithPginationCtrl);
router.get('/order/materials', getMaterialsCtrl);

//material type
const {AddMaterialTypeCtrl,getMaterialTypesCtrl} = require("../controllers/materialtypeController");
const uploadMT = createMulterConfig('uploads/MaterialType/');
// Route to get image by name
router.get('/image/materialtype/:filename', (req, res) => getImg(req, res, "uploads/MaterialType"));
router.post("/addmaterialtype", uploadMT.single('avatarMaterialType'),AddMaterialTypeCtrl);
/* router.get('/materialtypes', getMaterialTypesWithPginationCtrl); */
router.get('/order/materialtypes', getMaterialTypesCtrl);




//angle
const {AddAngleCtrl,getAnglesWithPginationCtrl,getAnglesCtrl} = require("./../controllers/angleController");
const uploadA = createMulterConfig('uploads/Angle/');
// Route to get image by name
router.get('/image/angle/:filename', (req, res) => getImg(req, res, "uploads/Angle"));
router.post("/addangle", uploadA.single('avatarAngle'),AddAngleCtrl);
router.get('/angles', getAnglesWithPginationCtrl);
router.get('/order/angles', getAnglesCtrl);




//edge
const {AddEdgeCtrl,getEdgesWithPginationCtrl,getEdgesCtrl} = require("./../controllers/edgeController");
const uploadE = createMulterConfig('uploads/Edge/');
// Route to get image by name
router.get('/image/edge/:filename', (req, res) => getImg(req, res, "uploads/Edge"));
router.post("/addedge", uploadE.single('avatarEdge'),AddEdgeCtrl);
router.get('/edges', getEdgesWithPginationCtrl);
router.get('/order/edges', getEdgesCtrl);




//order
const {orderprice} = require('./../controllers/orderController')
router.post("/orderprice", orderprice);








module.exports = router;

