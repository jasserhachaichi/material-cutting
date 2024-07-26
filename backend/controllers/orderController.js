const Shape = require("../models/Shape");
const Material = require("../models/Material");
const Angle = require("./../models/Angle");
const Edge = require("./../models/Edge");

/**-----------------------------------------------
 * @desc    Get Order Costs
 * @route   /product/orderprice
 * @method  GET
 * @access  private     
 ------------------------------------------------*/
 const orderprice = async (req, res) => {
    const data = req.body;
    console.log(data);
/*     const data = {
        projectName: 'jasser',
        shapeId: '66a02f0dace04ad487f4d0b8',
        A_value: '15',
        B_value: '35',
        material: '66a29b3242dcd945d3fd84e6',
        thickness: '35',
        angles: [
          { angleId: '66a10d8d1b2fd414897b8edc', borderRadius: '30' },
          { angleId: '66a10d8d1b2fd414897b8edc', borderRadius: '30' },
          { angleId: '66a10d8d1b2fd414897b8edc', borderRadius: '30' },
          { angleId: '66a134bea3f86245f74b97bf', borderRadius: '40' } 
        ],
        angledescription: [],
        edges: [
          { edgeId: '66a18a47e98f000c017f39d6' },
          { edgeId: '66a18a47e98f000c017f39d6' },
          { edgeId: '66a18a47e98f000c017f39d6' },
          { edgeId: '66a189bde98f000c017f39d4' }
        ],
        edgeDescription: []
      } */









    const A_value= data.A_value || 0;
    const B_value= data.B_value || 0;
    const C_value= data.C_value || 0;

    let result ={}
    result.A_value=A_value;
    result.B_value=B_value;
    result.C_value=C_value;
    result.projectName =data.projectName;
    try {
        // shape
        const shape = await Shape.findById(data.shapeId, 'shapeName price discountOption fixedDiscount pourcentageDiscount vatAmount');

        const OriginalShapeCost = (A_value+ B_value+ C_value) * shape.price ;

        result.shapeName = shape.shapeName;
        result.OriginalShapeCost = OriginalShapeCost;
        result.VatShape = shape.vatAmount;


        if(shape.discountOption == 2){
            result.DiscountedShapeCost = OriginalShapeCost - (OriginalShapeCost * shape.pourcentageDiscount*0.01);
            result.DiscountShape = shape.pourcentageDiscount + "%";
            result.DiscountShapeDT = (OriginalShapeCost * shape.pourcentageDiscount*0.01);
        }else if(shape.discountOption == 3){
            result.DiscountedShapeCost = OriginalShapeCost - shape.fixedDiscount;
            result.DiscountShape = shape.fixedDiscount + "DT";
            result.DiscountShapeDT = shape.fixedDiscount;
        }else if(shape.discountOption == 1){
            result.DiscountedShapeCost = 0;
            result.DiscountShape = 0 + "DT";
            result.DiscountShapeDT = 0;
        }

        //Material
        const material = await Material.findById(data.material, 'material_name price discount_option discounted_price discounted_percentage vat_amount material materialType');
        const OriginalMaterialCost = data.thickness * material.price ;

        result.materialName = material.material_name;
        result.OriginalMaterialCost  = OriginalMaterialCost;
        result.material  = material.material;
        result.materialType  = material.materialType;
        result.thickness = data.thickness;
        result.VatMaterial = material.vat_amount;

        if(material.discount_option == 2){
            result.DiscountedMaterialCost = OriginalMaterialCost - (OriginalMaterialCost * material.discounted_percentage *0.01);
            result.DiscountMaterial = material.discounted_percentage + "%";
            result.DiscountMaterialDT = (OriginalMaterialCost * material.discounted_percentage *0.01);
        }else if(material.discount_option == 3){
            result.DiscountedMaterialCost = OriginalMaterialCost - material.discounted_price;
            result.DiscountMaterial = material.discounted_price + "DT";
            result.DiscountMaterialDT = material.discounted_price;
        }else if(material.discount_option == 1){
            result.DiscountedMaterialCost = 0;
            result.DiscountMaterial = 0 + "DT";
            result.DiscountMaterialDT = 0;
        }


        //Angles
        let NBAngleCutted = 0;
        let angles = []; // Initialize angles array

        // Process each angle
        for (const Angleelm of data.angles) {
            if (Angleelm && Angleelm.angleId != null && Angleelm.borderRadius && Angleelm.borderRadius != null && Angleelm.angleId && Angleelm.angleId !== '' && Angleelm.angleId !== 'none' && Angleelm.borderRadius !== '' && Angleelm.borderRadius !== 'none') {
            NBAngleCutted++;
            const angle = await Angle.findById(Angleelm.angleId, 'Angle_name price discount_option discounted_price discounted_percentage vat_amount border_radius');
            if (!angle) {
                // Handle case where angle is not found
                continue;
            }

            const OriginalAngleCost = Angleelm.borderRadius * angle.price;

            let angleelmResult = {};
            angleelmResult.Angle_name = angle.Angle_name;
            angleelmResult.OriginalAngleCost = OriginalAngleCost;
            angleelmResult.VatAngle = angle.vat_amount;

            if (angle.discount_option === 2) {
                angleelmResult.DiscountedAngleCost = OriginalAngleCost - (OriginalAngleCost * angle.discounted_percentage * 0.01);
                angleelmResult.DiscountAngle = angle.discounted_percentage + "%";
                angleelmResult.DiscountAngleDT = (OriginalAngleCost * angle.discounted_percentage * 0.01);
            } else if (angle.discount_option === 3) {
                angleelmResult.DiscountedAngleCost = OriginalAngleCost - angle.discounted_price;
                angleelmResult.DiscountAngle = angle.discounted_price + "DT";
                angleelmResult.DiscountAngleDT = angle.discounted_price;
            } else {
                angleelmResult.DiscountedAngleCost = OriginalAngleCost; // No discount
                angleelmResult.DiscountAngle = 0 + "DT";
                angleelmResult.DiscountAngleDT = 0;
            }

            angles.push(angleelmResult);
            }
        }

        result.NBAngleCutted = NBAngleCutted;
        result.angles = angles;




                //Edges
                let NBEdgeCutted = 0;
                let edges = []; // Initialize edges array
        
                // Process each edge
                for (const Edgeelm of data.edges) {
                    if(Edgeelm &&  Edgeelm.edgeId && Edgeelm.edgeId != null &&  Edgeelm.edgeId != '' && Edgeelm.edgeId != 'none'){
                    NBEdgeCutted++;
                    const edge = await Edge.findById(Edgeelm.edgeId, 'Edge_name price discount_option discounted_price discounted_percentage vat_amount');
                    if (!edge) {
                        // Handle case where edge is not found
                        continue;
                    }
        
                    const OriginalEdgeCost = edge.price;
        
                    let edgeelmResult = {};
                    edgeelmResult.Edge_name = edge.Edge_name;
                    edgeelmResult.OriginalEdgeCost = OriginalEdgeCost;
                    edgeelmResult.VatEdge = edge.vat_amount;
        
                    if (edge.discount_option === 2) {
                        edgeelmResult.DiscountedEdgeCost = OriginalEdgeCost - (OriginalEdgeCost * edge.discounted_percentage * 0.01);
                        edgeelmResult.DiscountEdge = edge.discounted_percentage + "%";
                        edgeelmResult.DiscountEdgeDT = (OriginalEdgeCost * edge.discounted_percentage * 0.01);
                    } else if (edge.discount_option === 3) {
                        edgeelmResult.DiscountedEdgeCost = OriginalEdgeCost - edge.discounted_price;
                        edgeelmResult.DiscountEdge = edge.discounted_price + "DT";
                        edgeelmResult.DiscountEdgeDT = edge.discounted_price;
                    } else {
                        edgeelmResult.DiscountedEdgeCost = OriginalEdgeCost; // No discount
                        edgeelmResult.DiscountEdge = 0 + "DT";
                        edgeelmResult.DiscountEdgeDT = 0;
                    }
        
                    edges.push(edgeelmResult);
                }
                }
                result.NBEdgeCutted = NBEdgeCutted;
                result.edges = edges;

        // Send the shapes as JSON response
        return res.json(result);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error retrieving order', error });
      }
  };

  module.exports = { orderprice};