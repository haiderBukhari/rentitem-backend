const User = require("../models/Customer");


const adminVerify = (req, res, next) => {
    if(req.user.email !== process.env.ADMIN_EMAIL){
        return res.statsu(400).json({
            message: 'Invalid Request'
        })
    }
    next();
}

module.exports = adminVerify;