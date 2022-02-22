import * as jwt from "jsonwebtoken";
import * as bearerToken from "bearer-token";
import * as crypto from "crypto";

const APPSECRET = process.env.API_SECRET;

function authMiddleWare(req, res, next) {
  bearerToken(req, async (err, token) => {
    // SI HAY TOKEN
    if (token) {
      try {
        // SE VERIFICA QUE EL TOKEN EXISTA Y TENGA EL SECRET BIEN
        const data = jwt.verify(token, APPSECRET);
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

export { authMiddleWare, getHashFromString };
