const { Schema, model } = require("mongoose");

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["Valid", "Invalid", "Expired"],
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Token = model("Token", tokenSchema);

module.exports = Token;
