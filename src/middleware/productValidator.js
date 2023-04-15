const postValidation = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { stripUnknown: false, strict: true });
    return next();
  } catch (error) {
    res
      .status(401)
      .send({ errorName: error.name, errorMessage: error.message });
  }
};

const deleteValidation = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.params.id);
    return next();
  } catch (error) {
    res
      .status(401)
      .send({ errorName: error.name, errorMessage: error.message });
  }
};

const putValidation = (schema) => async (req, res, next) => {
  const productId = parseInt(req.params.id, 10); // convert id string to number
  if (isNaN(productId)) {
    res.status(400).json({
      errorName: "ValidationError",
      errorMessage: "id must be a `number` type",
    });
  } else {
    try {
      await schema.validate(req.body, { strict: true });
      return next();
    } catch (error) {
      res
        .status(401)
        .send({ errorName: error.name, errorMessage: error.message });
    }
  }
};

const getValidation = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { stripUnknown: false, strict: true });
    return next();
  } catch (error) {
    res
      .status(401)
      .send({ errorName: error.name, errorMessage: error.message });
  }
};

const getSpecificValidation = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.params.id);
    return next();
  } catch (error) {
    res
      .status(401)
      .send({ errorName: error.name, errorMessage: error.message });
  }
};

module.exports = {
  getValidation,
  postValidation,
  getSpecificValidation,
  putValidation,
  deleteValidation,
};
