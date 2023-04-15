const response = require("../utils/response");
const db = require("../confiq/connection");

const viewAllProduct = (req, res) => {
  const { merchant_id } = req.body;
  const sql = `select * from product where merchant_id = ?`;
  db.query(sql, [merchant_id], (error, result) => {
    if (error) {
      response(400, error.name, error.message, res);
    }
    if (result[0] == undefined) {
      response(404, "Result is undefined", "Your product is not found.", res);
      return;
    }
    response(200, result, "Here are your products.", res);
    return;
  });
};

//SHOW PRODUCT BY ID
const viewSpecificProduct = (req, res) => {
  const { id } = req.params;
  const sql = `select * from product where id = ?`;

  db.query(sql, [id], (error, result) => {
    if (error) {
      response(400, error.name, error.message, res);
      return;
    }
    if (result[0] == undefined) {
      response(404, "Result is undefined", "Your product is not found.", res);
      return;
    }
    response(200, result, "Here is your product.", res);
    return;
  });
};

//ADD PRODUCT
const addProduct = (req, res) => {
  const { merchant_id, name, quantity, price } = req.body;
  const sql = `Insert into product (merchant_id, name, quantity, price)
  values (?,?,?,?)`;

  db.query(sql, [merchant_id, name, quantity, price], (error, result) => {
    if (error) {
      response(400, error.name, error.message, res);
      return;
    }
    if (result.affectedRows) {
      const data = {
        isSuccess: result.affectedRows,
        ProductID: result.insertId,
      };
      response(
        200,
        data,
        "Your new product has been successfully stored in the database",
        res
      );
    }
  });
};
//UPDATE product
const updateProduct = (req, res) => {
  const { id } = req.params;
  const { merchant_id, name, quantity, price } = req.body;
  const sql = `UPDATE product SET merchant_id = ?, name = ?, quantity = ?, price = ? where id = ?`;
  db.query(sql, [merchant_id, name, quantity, price, id], (error, result) => {
    if (error) {
      response(400, error.name, error.message, res);
      return;
    }
    if (result.affectedRows == 0) {
      response(
        404,
        "Error updating product",
        `The product with the ID = ${id} is not found`,
        res
      );
      return;
    }
    const data = {
      isSuccess: result.affectedRows,
      message: result.message,
    };
    response(200, data, `The product with the ID = ${id} is updated`, res);
  });
};

//HAPUS PRODUCT LIST
const deleteProduct = (req, res) => {
  const { id } = req.params;
  const sql = `delete from product where id = ?`;
  db.query(sql, [id], (error, result) => {
    if (error) {
      response(400, error.name, error.message, res);
      return;
    }
    if (result.affectedRows) {
      const data = {
        isDeleted: result.affectedRows,
      };
      response(200, data, `Your product with ID = ${id} has been deleted`, res);
      return;
    } else {
      response(404, "error", `Your product with ID = ${id} is not found`, res);
    }
  });
};

module.exports = {
  viewAllProduct,
  viewSpecificProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
