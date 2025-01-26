const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function generateCertificate(certDir, userId, email, pin) {
  // Ensure absolute path
  const absoluteCertDir = path.resolve(certDir);

  // Create directory if it doesn't exist
  fs.mkdirSync(absoluteCertDir, { recursive: true });

  const privateKeyPath = path.join(absoluteCertDir, "private-key.pem");
  const publicKeyPath = path.join(absoluteCertDir, "public-key.pem");
  const certificatePath = path.join(absoluteCertDir, "certificate.pem");

  try {
    // Generate private key
    execSync(`openssl genrsa -out "${privateKeyPath}" 2048`);

    // Generate self-signed certificate
    execSync(
      `
      openssl req -x509 -new -nodes 
      -key "${privateKeyPath}" 
      -days 365 
      -out "${certificatePath}" 
      -subj "/CN=${email}/OU=${userId}"
    `.replace(/\n/g, " ")
    );

    // Extract public key
    execSync(
      `openssl x509 -pubkey -noout -in "${certificatePath}" > "${publicKeyPath}"`
    );

    // Read generated files
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");
    const publicKey = fs.readFileSync(publicKeyPath, "utf8");
    let certificate = fs.readFileSync(certificatePath, "utf8");

    // Remove the BEGIN and END lines of the certificate
    certificate = certificate
      .replace("-----BEGIN CERTIFICATE-----\n", "")
      .replace("-----END CERTIFICATE-----\n", "");

    return { privateKey, publicKey, certificate };
  } catch (error) {
    console.error("Certificate generation error:", error);
    throw new Error(`Certificate generation failed: ${error.message}`);
  }
}

module.exports = { generateCertificate };
