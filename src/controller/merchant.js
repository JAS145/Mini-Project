const response = require("../utils/response");
const db = require("../confiq/connection");
const bcrypt = require("bcrypt");

const createMerchantAccount = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const { name, address, join_date, phone_number } = req.body;
  const sql = `Insert into merchant (password,name, address, join_date, phone_number) 
  values (?,?,?,?,?)`;

  db.query(
    sql,
    [hashedPassword, name, address, join_date, phone_number],
    (error, result) => {
      if (error) {
        response(400, error.name, error.message, res);
        return;
      }
      if (result.affectedRows) {
        const data = {
          isSuccess: result.affectedRows,
          id: result.insertId,
        };
        response(200, data, "Your account is successfully created", res);
      }
    }
  );
};

//DELETE MERCHANT ACCOUNT
const deleteMerchantAccount = (req, res) => {
  const { id } = req.params;
  const sql2 = `delete from merchant where id = ?`;
  db.query(sql2, [id], (error, result) => {
    if (error) {
      response(400, error.name, error.message, res);
      return;
    }
    if (result.affectedRows != 0) {
      const data = {
        isDeleted: result.affectedRows,
      };
      response(200, data, "Your account has been deleted", res);
      return;
    } else {
      response(404, "error", "The account is not found", res);
    }
  });
};

module.exports = {
  createMerchantAccount,
  deleteMerchantAccount,
};
