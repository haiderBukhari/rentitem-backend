const { isNotFound } = require("entity-checker");
const Product = require("../models/Product"); // Your Product model
const mongoose = require('mongoose');
const User = require("../models/Customer");

const ProductController = {
  getProductListings: async (req, res) => {
    try {
      const userId = req.params.userId;
      const products = await Product.find({
        owner: { $ne: userId }
      }).populate("owner", "username");
      res.json(products);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  },

  filterProductListings: async (req, res) => {
    const userId = req.params.userId;
    try {
      const {
        country,
        state,
        city,
        verificationStatus,
        availableDays,
        datePosted,
        priceRange,
        category,
      } = req.query;

      const filters = {};

      if (city || country || state) {
        const searchRegex = new RegExp([city, country, state].filter(val => val).join('|'), 'i');
        filters["manufacturer.address"] = { $regex: searchRegex };
      }

      if (datePosted) {
        const parsedDatePosted = new Date(datePosted);
        filters.datePosted = {
          $gte: parsedDatePosted,
        };
      }
      if (priceRange) {
        const [minPrice, maxPrice] = JSON.parse(priceRange).map(Number); // Convert priceRange values to numbers
        filters.price = {
          $gte: minPrice,
          $lte: maxPrice,
        };
      }

      if (verificationStatus) {
        filters.verificationStatus = Boolean(verificationStatus);
      }

      if (availableDays) {
        filters.availableDays = { $gte: parseInt(availableDays) };
      }

      if (category) {
        filters.category = category;
      }

      const filteredProducts = await Product.find({
        ...filters,
        owner: { $ne: userId }
      });
      res.json(filteredProducts);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  },

  updateProductDetails: async (req, res) => {
    try {
      const { _id } = req.params;
      const {
        /* Update fields */
      } = req.body;

      const product = await Product.findById(_id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Update product details

      await product.save();
      res.json({ message: "Product details updated successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  },
  getProductDetailsbyID: async (req, res) => {
    try {
      const id = req.params.id;

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ product });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  },

  uploadProductPictures: async (req, res) => {
    try {
      const { _id } = req.params;
      const product = await Product.findById(_id);

      if (isNotFound(product)) {
        return res.status(404).json({ message: "Product not found" });
      }

      const files = req.files;
      const imagePaths = files.slice(0, 4).map((file) => file.path);

      product.images = imagePaths;

      await product.save();
      res.json({ message: "Pictures uploaded successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  },
};

const getProductsbyOwnerID = async (req, res) => {
  try {
    const page = req.param.page;
    const perPage = 10;
    const currentPage = parseInt(page) || 0;
    const product = await Product.find({ "owner": new mongoose.Types.ObjectId(req.params.id) }).populate("owner", "username")
    // .skip(currentPage * perPage).limit(perPage).exec();
    const totalProducts = await Product.countDocuments({ "owner": new mongoose.Types.ObjectId(req.params.id) });
    if (product) {
      res.json({ product, totalProducts });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const createProduct = async (req, res) => {
  try {
    if (!req.body.title || !req.body.description || !req.body.price || !req.body.pricePerDay || !req.body.category) {
      return res.status(404).json({ message: "Please enter all the fields" });
    }
    const product = await Product.create(req.body);
    res.status(200).json({ product: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateProduct = async (req, res) => {
  try {
    if (!req.body.title || !req.body.description || !req.body.price || !req.body.pricePerDay || !req.body.category) {
      return res.status(404).json({ message: "Please enter all the fields" });
    }
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    )
    res.status(200).json({ product: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


const DeleteProduct = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.owner });
    if (user.isAdmin) {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      const data = await Product.findOneAndDelete({ _id: req.params.id, owner: req.params.owner });
      res.status(200).json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}
const SearchItem = async (req, res) => {
  const userId = req.params.userId;
  const searchTerm = req.query.search;
  try {
    const data = await Product.find({
      $and: [
        {
          $or: [
            { description: { $regex: searchTerm, $options: 'i' } },
            { title: { $regex: searchTerm, $options: 'i' } }
          ]
        },
        {
          owner: { $ne: userId }
        }
      ]
    });
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const addReview = async (req, res) => {
  try {
    const { productId, user, comment, rating } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create a new review object
    const newReview = {
      user,
      comment,
      rating
    };

    // Add the new review to the product's reviews array
    product.reviews.unshift(newReview);

    await product.save();
    res.json({ message: "Review added successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  ProductController,
  getProductsbyOwnerID,
  createProduct,
  DeleteProduct,
  SearchItem,
  updateProduct,
  addReview
};
