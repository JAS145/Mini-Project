const express = require("express");
const router = express.Router();
const merchantController = require("../controller/merchant");
const auth = require("../middleware/authentication");
const merchantValidator = require("../middleware/merchantValidator");
const merchantValidation = require("../validations/merchantValidation");

router.post(
  "/",
  merchantValidator.postValidation(merchantValidation.merchantPostSchema),
  merchantController.createMerchantAccount
);
router.delete(
  "/:id",
  auth,
  merchantValidator.deleteValidation(merchantValidation.merchantDeleteSchema),
  merchantController.deleteMerchantAccount
);

module.exports = router;
