const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [
        {
            message: { type: String },
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            time: { type: Date, default: Date.now }
        }
    ]
});

const Message = mongoose.model('Messages', messageSchema);

module.exports = Message;
