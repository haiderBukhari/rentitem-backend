const orders = require("../models/Order");

const createOrder = async (req, res) => {
    try {
        const data = await orders.create(req.body);       
        res.status(200).json({
            status: "success",
            data
        })
    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: err.message
        })
    }
}

const getOrderbyUserID = async (req, res) => {
    try {
        const data = await orders.find({ customerId: req.params.id });
        if (!data.length) throw new Error("No Product found");
        res.status(200).json({
            status: "success",
            data
        })
    } catch (err) {
        res.status(404).json({
            message: err.message
        })
    }
}

const getOrderbyUserAndProductID = async (req, res) => {
    try {
        const data = await orders.find({ _id: req.params.orderid, customerId: req.params.id });
        if (!data.length) throw new Error("No Product found");
        res.status(200).json({
            status: "success",
            data
        })
    } catch (err) {
        res.status(404).json({
            message: err.message
        })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const data = await orders.find();
        if (!data.length) throw new Error("No Product found");
        res.status(200).json({
            status: "success",
            data
        })
    } catch (err) {
        res.status(404).json({
            message: err.message
        })
    }
}

const getVendorOrders = async (req, res) => {
    try {
        const ownerId = req.params.id;
        const order = await orders.find({ "orderData.owner": ownerId });
        order.forEach((Item) => {
            Item.orderData = Item.orderData.filter(item => item.owner.toString() === ownerId);
        });

        if (!order.length) {
            throw new Error("No orders found");
        }
        res.status(200).json({
            status: "success",
            data: order
        });
    } catch (err) {
        res.status(404).json({
            message: err.message
        })
    }
}

const getVendorOrdersbyProductID = async (req, res) => {
    try {
        const ownerId = req.params.id;
        const id = req.params.productid;
        const order = await orders.find({ "orderData.owner": ownerId, _id: id });
        order.forEach((Item) => {
            Item.orderData = Item.orderData.filter(item => item.owner.toString() === ownerId);
        });

        if (!order.length) {
            throw new Error("No orders found");
        }
        res.status(200).json({
            status: "success",
            data: order
        });
    } catch (err) {
        res.status(404).json({
            message: err.message
        })
    }
}

module.exports = {
    getAllOrders,
    createOrder,
    getOrderbyUserID,
    getOrderbyUserAndProductID,
    getVendorOrdersbyProductID,
    getVendorOrders
}
