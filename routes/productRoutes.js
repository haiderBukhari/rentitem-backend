const express = require("express");
const router = express.Router();
const {ProductController, getProductsbyOwnerID, createProduct, DeleteProduct, SearchItem, updateProduct, addReview} = require("../controllers/productController");

router.get('/search/:userId', SearchItem)
// Browse all products
// router.get("/:userId", ProductController.getProductListings);

router.get("/:id", ProductController.getProductDetailsbyID);

router.post("/", createProduct);

router.post("/review", addReview);
// Filter products based on query parameters
router.get("/filter/:userId", ProductController.filterProductListings);

router.put("/:id", updateProduct);
// Update product details by ID
router.put("/:id/details", ProductController.updateProductDetails);

// Upload pictures for a product by ID
router.put("/:id/pictures", ProductController.uploadProductPictures);


router.get("/:id/:page", getProductsbyOwnerID);

router.delete("/:id/:owner", DeleteProduct)



module.exports = router;
