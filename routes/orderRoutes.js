const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

router.post('/', orderController.createOrder)
router.get('/', orderController.getAllOrders)
router.get('/:id', orderController.getOrderbyUserID)
router.get('/vendor/:id', orderController.getVendorOrders)
router.get('/vendor/:id/:productid', orderController.getVendorOrdersbyProductID)
router.get('/:id/:orderid', orderController.getOrderbyUserAndProductID)

module.exports = router;
