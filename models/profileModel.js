const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        unique: true
    },
    dob: {
        type: Date,
        default: "",
    },
    gender: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: Number,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    profileDescription: {
        type: String,
        default: ""
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true
    }
});

// Create a 2dsphere index on the 'location' field
const ProfileModel = mongoose.model("Profiles", profileSchema);

module.exports = ProfileModel;