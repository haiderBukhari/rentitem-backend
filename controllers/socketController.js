const User = require("../models/Customer");

const ConnectUser = async (socketId, userId) => {
    const data = await User.findById(userId);
    if(!data){
        return;
    }
    data.socketId = socketId;
    await data.save();
}

const DisconnectUser = async (socketId) => {
    const data = await User.findOne({socketId: socketId});
    if(!data){
        return;
    }
    data.socketId = "";
    console.log("removed")
    await data.save();
}

module.exports = { ConnectUser, DisconnectUser };