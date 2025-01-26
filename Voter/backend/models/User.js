const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  pin: { type: String, required: true },
  certificate: { type: String, required: true },
  privateKey: { type: String, required: true },
  publicKey: { type: String, required: true },
  voted: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
