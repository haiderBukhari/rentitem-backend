const Customer = require("../models/Customer");
const Product = require("../models/Product"); // Your Product model
const ProfileModel = require("../models/profileModel");
const orders = require("../models/Order");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isNotFound } = require("entity-checker");

const CustomerController = {
  updateProfile: async (req, res) => {
    const { username, email, phoneNumber, location } = req.body;
    const customerId = req.customer._id;

    try {
      const customer = await Customer.findById(customerId);

      if (isNotFound(customer)) {
        return res.status(404).json({ message: "Customer not found" });
      }

      customer.username = username || customer.username;
      customer.email = email || customer.email;
      customer.phoneNumber = phoneNumber || customer.phoneNumber;
      customer.location = location || customer.location;

      await customer.save();
      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  },

  uploadProfilePicture: async (req, res) => {
    try {
      const customer = await customer.findById(req.customer._id); // Assuming authenticated Customer ID is attached to the request

      if (isNotFound(customer)) {
        return res.status(404).json({ message: "Customer not found" });
      }

      customer.profilePicture = req.file.path;
      await customer.save();

      res.json({ message: "Profile picture uploaded successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  },

  deleteProfile: async (req, res) => {
    const customerId = req.customer._id;

    try {
      const customer = await Customer.findByIdAndDeconste(customerId);

      if (isNotFound(customer)) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.json({ message: "Profile deconsted successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  },
  updateCustomerConversion: async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedCustomer = await Customer.findByIdAndUpdate(userId, { isCustomer: req.params.type === "customer", isVendor: req.params.type === "vendor" }, { new: true });

      res.status(200).json({ data: updatedCustomer });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const customer = await Customer.findById(userId);
      if (customer) {
        await Customer.findByIdAndDelete(userId);
      }

      const products = await Product.find({ owner: userId });
      if (products.length > 0) {
        await Product.deleteMany({ owner: userId });
      }

      const profile = await ProfileModel.findOne({ userId: userId });
      if (profile) {
        await ProfileModel.deleteOne({ userId: userId });
      }

      const customerOrders = await orders.find({ customerId: userId });
      if (customerOrders.length > 0) {
        await orders.deleteMany({ customerId: userId });
      }

      res.status(200).json({ data: "deleted" });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = CustomerController
