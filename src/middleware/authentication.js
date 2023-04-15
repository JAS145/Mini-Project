const bcrypt = require("bcrypt");
const basicAuth = require("basic-auth");
const db = require("../confiq/connection");
const response = require("../utils/response");

const auth = (req, res, next) => {
  const user = basicAuth(req);
  const sql1 = `select * from merchant where name =?`;
  db.query(sql1, [user.name, user.pass], (error, result) => {
    if (error) {
      response(400, error, "An error occurred", res);
      return;
    }
    if (!user.name || !user.pass) {
      response(
        400,
        "No input username or password",
        "Authentication is required",
        res
      );
      return;
    }
    if (result.length === 0) {
      response(
        401,
        "No Data Authentication Found",
        "Your account with the username is not found. Unauthorized",
        res
      );
      return;
    }
    const hasil = result[0];
    bcrypt.compare(user.pass, hasil.password, (error, isMatch) => {
      if (error) {
        response(400, error.name, "Error comparing password", res);
        return;
      }
      if (!isMatch) {
        response(401, "No Authentication Data Found", "Unauthorized", res);
        return;
      }
      next();
    });
  });
};

module.exports = auth;
