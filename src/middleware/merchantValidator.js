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
    await schema.validate(req.params.id, {});
    return next();
  } catch (error) {
    res
      .status(401)
      .send({ errorName: error.name, errorMessage: error.message });
  }
};

module.exports = {
  postValidation,
  deleteValidation,
};
