const ProfileModel = require("../models/profileModel");

const createProfile = async (req, res) => {
    try {
        const data = await ProfileModel.create(req.body);
        res.status(200).json({
            data
        })
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateProfile = async (req, res) => {
    try {
        const profileId = req.params.id;
        const updatedData = req.body;

        const updatedProfile = await ProfileModel.findByIdAndUpdate(profileId, updatedData, { new: true });

        if (!updatedProfile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.status(200).json({ data: updatedProfile });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getProfile = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await ProfileModel.find({userId: productId});

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ data: product });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createProfile,
    updateProfile,
    getProfile
}