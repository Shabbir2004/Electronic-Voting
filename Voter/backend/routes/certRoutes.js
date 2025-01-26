// backend/routes/certRoutes.js
const express = require("express");
const { generateCert } = require("../controllers/certController");
const router = express.Router();

// Route to generate the certificate
router.post("/generate", generateCert);

module.exports = router;
