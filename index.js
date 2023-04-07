const express = require("express");
const app = express();
app.use(express.json());
const db = require("./connection");
const basicAuth = require("basic-auth");
const response = require("./response");

// Middleware to require basic auth for all requests
const auth = (req, res, next) => {
  const user = basicAuth(req);
  const sql1 = `select * from merchant where name =? and password = ?`;
  db.query(sql1, [user.name, user.pass], (err, result) => {
    if (err) {
      response(400, "Invalid input", "Invalid input", res);
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
    const hasil = result[0];
    if (!hasil) {
      response(401, "No Data Found", "Unauthorized", res);
      return;
    }
    next();
  });
};

//CREATE MERCHANT ACCOUNT
app.post("/merchant", (req, res) => {
  const { password, name, address, join_date, phone_number } = req.body;
  const sql = `Insert into merchant (password,name, address, join_date, phone_number) 
values (?,?,?,?,?)`;
  const theColumns = [password, name, address, join_date, phone_number];
  if (
    Object.entries(req.body).length == 5 &&
    "password" in req.body &&
    typeof req.body.password == "string" &&
    "name" in req.body &&
    typeof req.body.name == "string" &&
    "address" in req.body &&
    typeof req.body.address == "string" &&
    "join_date" in req.body &&
    typeof req.body.join_date == "string" &&
    "phone_number" in req.body &&
    typeof req.body.phone_number == "string"
  ) {
    db.query(sql, theColumns, (error, result) => {
      if (error) {
        response(400, "invalid input", "The passsword has been used", res);
        return;
      } else if (result.affectedRows) {
        const data = {
          isSuccess: result.affectedRows,
          id: result.insertId,
        };
        response(201, data, "Your account is successfully created", res);
      }
    });
  } else {
    response(400, "Invalid input", "Your input data is invalid", res);
  }
});

//DELETE MERCHANT ACCOUNT
app.delete("/merchant/:id", (req, res) => {
  const user = basicAuth(req);
  const { id } = req.params;
  const sql1 = `select * from merchant where name =? `;
  const sql2 = `delete from merchant where id = ${id}`;

  db.query(sql1, [user.name, user.pass], (err, result) => {
    if (err) {
      response(400, "Invalid input", "Invalid input", res);
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
    const hasil = result[0];
    if (!hasil) {
      response(401, "No Data Found", "Unauthorized", res);
      return;
    }
    if (`${hasil.id}` != id) {
      //Please discuss this one to the mentor (asking how manage the same result/purpose of this if we want to make the auth basic by just putting it in parameters in SQL Query)
      res.status(400).send("Invalid ID input");
      return;
    }
    db.query(sql2, [id], (err, result) => {
      if (err) {
        response(400, "Invalid input", "Your input data is invalid", res);
      }

      if (result) {
        const data = {
          isDeleted: result.affectedRows,
        };
        response(200, result, "your account has been deleted", res);
      } else {
        response(404, "error", "The account is not found", res);
      }
    });
  });
});

// Product Information
//SHOW ALL PRODUCT
app.get("/product", auth, (req, res) => {
  const { merchant_id } = req.body;
  const sql = `select * from product where merchant_id = ?`;
  if (
    Object.entries(req.body).length == 1 &&
    "merchant_id" in req.body &&
    typeof req.body.merchant_id == "number"
  ) {
    db.query(sql, [merchant_id], (error, result) => {
      if (error) throw error;
      if (result[0] == undefined) {
        response(404, "Result is undefined", "Your product is not found.", res);
        return;
      }
      response(200, result, "Here are your products.", res);
      return;
    });
  } else {
    response(
      400,
      "Invalid input",
      "Make sure you the input data is valid.",
      res
    );
  }
});

//SHOW PRODUCT BY ID
app.get("/product/:id", auth, (req, res) => {
  const { id } = req.params;
  const sql = `select * from product where id = ?`;

  db.query(sql, [id], (error, result) => {
    if (error) throw error;

    if (result[0] == undefined) {
      response(404, "Result is undefined", "Your product is not found.", res);
      return;
    }
    response(200, result, "Here is your product.", res);
    return;
  });
});

//ADD PRODUCT
app.post("/product", auth, (req, res) => {
  const { merchant_id, name, quantity, price } = req.body;
  const sql = `Insert into product (merchant_id, name, quantity, price)
values (?,?,?,?)`;
  if (
    Object.entries(req.body).length == 4 &&
    "merchant_id" in req.body &&
    typeof req.body.merchant_id == "number" &&
    "name" in req.body &&
    typeof req.body.name == "string" &&
    "quantity" in req.body &&
    typeof req.body.quantity == "number" &&
    "price" in req.body &&
    typeof req.body.price == "string"
  ) {
    db.query(sql, [merchant_id, name, quantity, price], (error, result) => {
      if (error) {
        response(
          400,
          "Invalid input",
          "The product has already been in the database. Please update the data instead.", //masih bingung gimana cara membatasinya dari server untuk set kalau sudah ada data product dimana merchant_id dengan nama product, tampilkan error.
          res
        );
        return;
      } else if (result.affectedRows) {
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
  } else {
    response(
      400,
      "Invalid input",
      "Make sure you the input data is valid.",
      res
    );
  }
});
//UPDATE product
app.put("/product/:id", auth, (req, res) => {
  const { id } = req.params;
  const { merchant_id, name, quantity, price } = req.body;
  const sql = `UPDATE product SET merchant_id = ?, name = ? quantity = ?, price = ? where id = ?`;
  db.query(sql, [merchant_id, name, quantity, price, id], (error, result) => {
    if (error) {
      response(400, "Invalid input", "Make sure the input data is valid");
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
    if (
      Object.entries(req.body).length == 4 &&
      "merchant_id" in req.body &&
      typeof req.body.merchant_id == "number" &&
      "name" in req.body &&
      typeof req.body.name == "string" &&
      "quantity" in req.body &&
      typeof req.body.quantity == "number" &&
      "price" in req.body &&
      typeof req.body.price == "string" &&
      result.affectedRows
    ) {
      const data = {
        isSuccess: result.affectedRows,
        message: result.message,
      };
      response(200, data, `The product with the ID = ${id} is updated`, res);
    } else
      response(
        404,
        "Error updating product",
        `Make sure the input data is valid`,
        res
      );
  });
});

//HAPUS PRODUCT LIST
app.delete("/product/:id", auth, (req, res) => {
  const { id } = req.params;
  const sql = `delete from product where id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      response(400, "Invalid input", "Make sure the input data is valid", res);
      return;
    }

    if (result.affectedRows) {
      const data = {
        isDeleted: result.affectedRows,
      };
      response(200, data, `Your product with ID = ${id} been deleted`, res);
      return;
    } else {
      response(404, "error", `Your product with ID = ${id} is not found`, res);
    }
  });
});
app.listen(3000);
