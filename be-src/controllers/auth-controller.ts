import * as jwt from "jsonwebtoken";
import { Auth } from "../models/models";
import { getHashFromString } from "../middleware/methods";
import { recoverPassWordEmail } from "../lib/sendgrid";

const APPSECRET = process.env.API_SECRET;

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

async function sentNewPassWordEmail(recoverData: {
  userEmail: string;
  newPassWord: string;
}) {
  const { userEmail, newPassWord } = recoverData;

  // VERIFICA QUE TODOS LOS DATOS DEL USER LLEGUEN CORRECTAMENTE
  if (!recoverData.userEmail || !recoverData.newPassWord) {
    return { error: "Faltan datos para enviar el reporte" };
  }

  // SE EXTRAE LA DATA
  const emailData = { userEmail, newPassWord };

  // SE HASEHA LA NUEVA CONTRASEÑA
  const newPassWordHashed = getHashFromString(newPassWord);

  // SE EDITA LA NUEVA CONTRASEÑA EN LA TABLA AUTH
  await Auth.update(
    { password: newPassWordHashed },
    {
      where: { email: userEmail },
    }
  );

  // SE ENVIA LA PROMESA DE ENVIO DE EMAIL
  const promiseRes = await recoverPassWordEmail(emailData);

  // SI EL MAIL SE ENVIA CORRECTAMENTE, DEVUELVE LA RESPUESTA POR MENSAJE
  if (promiseRes.response) {
    return {
      message:
        "Te hemos enviado un email a tu casilla de correo con tu nueva contraseña provisoria",
    };
  }
}
export { checkEmail, getToken, sentNewPassWordEmail };
