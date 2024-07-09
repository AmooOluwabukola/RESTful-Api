const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const mongoose = require("mongoose");

const fs = require("fs");
const cloudinary = require("cloudinary").v2;



// post Products
router.post("/", (req, res, next) => {
  const { name, price, imagePath } = req.body;

  Product.findOne({ name })
    .exec()
    .then((product) => {
      if (product) {
        return res.status(409).json({
          error: "Product with the same name already exists",
        });
      }

      const newProduct = new Product({
        _id: new mongoose.Types.ObjectId(),
        name,
        price,
        imagePath,
      });

      newProduct
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            message: "Product Created successfully",
            createdProduct: result,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});


// get all products
router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});


// get product id
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log("From Database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided Id" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = req.body;
  Product.updateOne({ _id: id }, { $set: updateOps })
   .exec()
   .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
   .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.put("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const product = req.body;
  Product.findByIdAndUpdate(id, product, { new: true })
   .exec()
   .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
   .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//   delete product
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
