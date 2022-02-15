import * as jwt from "jsonwebtoken";
import { Auth } from "../models/models";
import { getHashFromString } from "../middleware/methods";

/* // COMENTAR ESTO AL HACER DEPLOY!
import { SECRET } from "../../keys/secret"; */

const APPSECRET = process.env.API_SECRET; /*  || SECRET; */

async function checkEmail(userData: { email: string }) {
  const { email } = userData;

  // SI FALTAN LOS DATOS DEVUELVE UN ERROR
  if (!userData.email) {
    return { error: "Faltan datos del usuario" };
  }

  // BUSCA EL EMAIL EN LA TABLA AUTH
  const findResponse = await Auth.findOne({
    where: { email: email },
  });

  // SI LO ENCUENTRA DEVUELVE UN TRUE
  if (findResponse) {
    return { true: "El usuario esta registrado" };
  }

  // SI NO LO ENCUENTRA DEVUELVE UN FALSE
  if (!findResponse) {
    return { false: "El usuario no esta registrado" };
  }
}

async function getToken(userData: { email: string; password: string }) {
  const { email, password } = userData;

  // SI FALTAN LOS DATOS DEVUELVE UN ERROR
  if (!userData.email || !userData.password) {
    return { error: "Faltan datos del usuario" };
  }

  // BUSCA EL EMAIL EN LA TABLA AUTH
  const authResponse = await Auth.findOne({
    where: {
      email,
      password: getHashFromString(password),
    },
  });

  // SI EXISTE DEVUELVE EL TOKEN
  if (authResponse) {
    const token = jwt.sign({ id: authResponse.get("UserId") }, APPSECRET);
    return { token };
  }

  // SI NO EXISTE NO DEVUELVE UN ERROR
  if (!authResponse) {
    return {
      error: "La contraseña es incorrecta",
    };
  }
}
export { checkEmail, getToken };
