const express = require("express");
const router = express.Router();
const merchantController = require("../controller/product");
const auth = require("..//middleware/authentication");
const productValidator = require("../middleware/productValidator");
const productValidation = require("../validations/productValidation");

router.post(
  "/",
  auth,
  productValidator.postValidation(productValidation.addProductSchema),
  merchantController.addProduct
);
router.delete(
  "/:id",
  auth,
  productValidator.deleteValidation(productValidation.deleteProductSchema),
  merchantController.deleteProduct
);
router.put(
  "/:id",
  auth,
  productValidator.putValidation(productValidation.updateProductSchema),
  merchantController.updateProduct
);
router.get(
  "/",
  auth,
  productValidator.getValidation(productValidation.viewAllProductSchema),
  merchantController.viewAllProduct
);
router.get(
  "/:id",
  auth,
  productValidator.getSpecificValidation(
    productValidation.viewSpecificProductSchema
  ),
  merchantController.viewSpecificProduct
);

module.exports = router;
