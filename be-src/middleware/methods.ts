import * as jwt from "jsonwebtoken";
import * as bearerToken from "bearer-token";
import * as crypto from "crypto";
import { SECRET } from "../../keys/secret";

function authMiddleWare(req, res, next) {
  bearerToken(req, async (err, token) => {
    // SI HAY TOKEN
    if (token) {
      try {
        // SE VERIFICA QUE EL TOKEN EXISTA Y TENGA EL SECRET BIEN
        const data = jwt.verify(token, SECRET);
        req.userData = data;
        next();
      } catch (e) {
        // SI NO ESTA VALIDADO O NO EXISTE EL USER EN AUTH SE DEVUELVE UN ERROR
        res
          .status(401)
          .json({ error: "Estas invalidado para acceder a la base" });
      }
    }
    // SI NO HAY TOKEN NI HEADER SE DEVUELVE UN ERROR
    if (!token) {
      res.status(401).json({
        error:
          "Lo siento pero la petición no cuenta con headers de autorización",
      });
    }
  });
}

function getHashFromString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

/* function crypt(hash) {
  // Node.js program to demonstrate the
  // crypto.createDecipheriv() method

  // Includes crypto module
  const crypto = require("crypto");

  // Difining algorithm
  const algorithm = "aes-256-cbc";

  // Defining key
  const key = crypto.randomBytes(32);

  // Defining iv
  const iv = crypto.randomBytes(16);

  // An encrypt function
  function encrypt(text) {
    // Creating Cipheriv with its parameter
    let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

    // Updating text
    let encrypted = cipher.update(text);

    // Using concatenation
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Returning iv and encrypted data
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
  }

  // A decrypt function
  function decrypt(text) {
    let iv = Buffer.from(text.iv, "hex");
    let encryptedText = Buffer.from(text.encryptedData, "hex");

    // Creating Decipher
    let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);

    // Updating encrypted text
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    // returns data after decryption
    return decrypted.toString();
  }

  // Encrypts output
  var output = encrypt(hash);
  console.log(output);

  // Decrypts output
  console.log(decrypt(output));
} */

export { authMiddleWare, getHashFromString };
