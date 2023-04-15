require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const merchant = require("./src/route/merchant");
const product = require("./src/route/product");
const PORT = process.env.PORT || 5000;

app.use("/merchant", merchant);
app.use("/product", product);
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
