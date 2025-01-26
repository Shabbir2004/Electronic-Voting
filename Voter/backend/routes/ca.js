const express = require("express");
const path = require("path");

const User = require("../models/User");
const { generateCertificate } = require("../utils/sslUtils");
const bcrypt = require("bcrypt");
const router = express.Router();

// Function to remove PEM headers and footers
const stripPEMHeaders = (pemString) => {
  return pemString
    .replace(/-----BEGIN [\w\s]+-----/, "") // Remove BEGIN header
    .replace(/-----END [\w\s]+-----/, "") // Remove END footer
    .replace(/\s+/g, ""); // Remove all whitespace and newlines
};

router.post("/generate", async (req, res) => {
  const { userId, email, pin } = req.body;

  try {
    // Generate certificates and keys
    const certDir = path.join(__dirname, "../certs", userId);
    const { privateKey, publicKey, certificate } = await generateCertificate(
      certDir,
      userId,
      email,
      pin
    );

    // Clean the PEM contents (remove BEGIN and END markers)
    const cleanedPrivateKey = stripPEMHeaders(privateKey);
    const cleanedPublicKey = stripPEMHeaders(publicKey);
    const cleanedCertificate = stripPEMHeaders(certificate);

    // Hash private key and certificate using bcrypt (for security)
    const hashedPrivateKey = await bcrypt.hash(cleanedPrivateKey, 10); // Salt rounds: 10
    const hashedCertificate = await bcrypt.hash(cleanedCertificate, 10);

    // Save user to the database
    const newUser = new User({
      email,
      pin,
      certificate: cleanedCertificate, // Store the cleaned certificate
      privateKey: hashedPrivateKey, // Store the hashed private key
      publicKey: cleanedPublicKey, // Public key is usually not encrypted
      voted: false, // Set voted status as false by default
    });

    await newUser.save();

    res.status(200).json({
      message: "User registered successfully",
      certificate: cleanedCertificate,
      privateKey: hashedPrivateKey,
      publicKey: cleanedPublicKey,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      error: "Registration failed",
      details: error.message,
    });
  }
});

module.exports = router;
