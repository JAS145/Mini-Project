const response = (statusCode, data, message, res) => {
  res.status(statusCode).json({
    payload: data,
    message,
    pagination: {
      prev: "",
      next: "",
      current: "",
    },
  });
};
module.exports = response;
