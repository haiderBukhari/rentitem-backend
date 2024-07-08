const Message = require('../models/Message');
const User = require("../models/Customer");

const messageController = {};

messageController.getMessagesBySenderId = async (req, res) => {
    const senderId = req.params.senderId;
    try {
        const messages = await Message.find({ senderId });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

messageController.getMessagesByReceiverId = async (req, res) => {
    const receiverId = req.params.receiverId;
    try {
        const messages = await Message.find({ receiverId });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addMessage = async (senderId, receiverId, message, senderId1) => {
    try {
        let SocketID;
        if (senderId !== senderId1) {
            let temp = await User.findById(senderId);
            SocketID = temp.socketId;
        } else {
            let temp = await User.findById(receiverId);
            SocketID = temp.socketId;
        }
        let existingMessage = await Message.findOne({ senderId, receiverId });

        if (!existingMessage) {
            existingMessage = await Message.findOne({ senderId: receiverId, receiverId: senderId });
        }

        if (existingMessage) {
            existingMessage.messages.push({ message, senderId: senderId1 });
            await existingMessage.save();
            return { SocketID, newMessage: existingMessage.messages[existingMessage.messages.length - 1] };
        } else {
            const newMessage = new Message({
                senderId,
                receiverId,
                messages: [{ message, senderId: senderId1 }]
            });
            await newMessage.save();
            return { SocketID, newMessage: newMessage.messages[newMessage.messages.length - 1] };
        }
    } catch (err) {
        return [];
    }
};

const createMessage = async (senderId, receiverId) => {
    try {
        let existingMessage = await Message.findOne({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        });
        if (existingMessage) {
            let allData = await Message.find({
                $or: [
                    { receiverId: receiverId },
                    { senderId: receiverId }
                ]
            });
            return allData;
        }
        else {
            const newMessage = new Message({
                senderId,
                receiverId,
                message: []
            });
            await newMessage.save();
            let allData = await Message.find({
                $or: [
                    { receiverId: receiverId },
                    { senderId: receiverId }
                ]
            });
            return allData;
        }
    } catch (err) {
        return [];
    }
}
const getMessagesByUserId = async ({ id }) => {
    const userId = id;
    try {
        const messages = await Message.find({ $or: [{ senderId: userId }, { receiverId: userId }] });
        return messages;
    } catch (err) {
        console.error(err);
        return [];
    }
};


module.exports = { getMessagesByUserId, createMessage, addMessage };