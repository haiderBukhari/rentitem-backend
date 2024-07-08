const User = require("../models/Customer");

const getAllVendorDetails = async (req, res) => {
    try {
        const { page } = req.query; // Assuming page is sent as a query parameter
        const perPage = 10; // Number of items per page

        const query = { isAdmin: false, isActive: true }; // Query to find items where isVendor is true

        const currentPage = parseInt(page) || 0;

        const items = await User.find(query)
            .skip(currentPage * perPage)
            .limit(perPage)
            .exec();

        res.json({
            items,
            currentPage,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports = {
    getAllVendorDetails
}