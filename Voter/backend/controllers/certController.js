// backend/controllers/certController.js
const generateCert = async (req, res) => {
  const { userId, email } = req.body;

  try {
    const { keyFile, certFile } = await opensslUtils.generateCertificate(
      userId,
      email
    );
    res.json({
      message: "Certificate generated successfully!",
      certificate: certFile,
      privateKey: keyFile,
    });
  } catch (err) {
    console.error("Error generating certificate:", err); // Log the error for more insights
    res.status(500).json({ error: err.message });
  }
};
