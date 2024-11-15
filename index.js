require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./helper/db");
const product = require("./Model/product");

const app = express();

app.use(cors());
app.use(bodyParser.json());

connectDB(process.env.MONGO_DB);

app.get("/", (req, res) => {
  res.json({
    status: false,
    message: "Server is alive.",
  });
});

app.post("/api/product/add", async (req, res) => {
  try {
    let { name, price, image } = req.body;

    if (!name || !price || !image) {
      return res.json({ status: false, message: "Please fill all fields." });
    }

    let newProduct = product.create({
      name: name,
      price: price,
      image: image,
    });

    if (newProduct) {
      return res.json({ status: true, message: "Product added successfully." });
    } else {
      return res.json({ status: false, message: "Failed to add product." });
    }
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    let products = await product.find().exec();
    if (products && products.length > 0) {
      res.json({ status: true, message: "Product Found.", data: products });
    } else {
      res.json({ status: false, message: "No product found.", data: [] });
    }
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running http://127.0.0.1:${process.env.PORT}.`);
});
