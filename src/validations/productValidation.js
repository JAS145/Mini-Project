const yup = require("yup");

const addProductSchema = yup
  .object({
    merchant_id: yup.number().required(),
    name: yup.string().required(),
    quantity: yup.number().required(),
    price: yup.string().required(),
  })
  .noUnknown(`Invalid input`);

const updateProductSchema = yup
  .object({
    merchant_id: yup.number().required(),
    name: yup.string().required(),
    quantity: yup.number().required(),
    price: yup.string().required(),
  })
  .noUnknown(`Invalid input`);

const deleteProductSchema = yup.number({
  id: yup.object({ id: yup.number().required() }).required(),
});

const viewAllProductSchema = yup
  .object({
    merchant_id: yup.number().required(),
  })
  .noUnknown(`Invalid input`);

const viewSpecificProductSchema = yup.number({
  id: yup.object({ id: yup.number().required() }).required(),
});

module.exports = {
  addProductSchema,
  updateProductSchema,
  deleteProductSchema,
  viewAllProductSchema,
  viewSpecificProductSchema,
};
