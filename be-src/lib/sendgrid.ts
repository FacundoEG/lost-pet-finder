const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendReportEmail(emailData) {
  const { name, phone, message, petName, petReporterEmail, petReporterName } =
    emailData;

  const messageToSend = {
    to: petReporterEmail,
    from: "F_E_G.93@hotmail.com",
    subject: "Tenemos nueva información de tu mascota perdida",
    text: "Hola! tenemos nueva información",
    html: `<h1>LOST PETS APP</h1><p>Hola <strong>${petReporterName}</strong>! tenemos nueva información sobre la mascota que reportaste con el nombre <strong>${petName}</strong> porfavor contactate con <strong>${name}</strong> cuyo numero de telefono es <strong>${phone}</strong></p><p>A continuación te dejamos la descripción de la ultima ubicación donde estaba: </p><p>${message}</p>`,
  };
  const mailsentRes = await sgMail.send(messageToSend);
  return { message: "Información enviada!", response: mailsentRes };
}

export async function recoverPassWordEmail(emailData) {
  const { userEmail, newPassWord } = emailData;

  const messageToSend = {
    to: userEmail,
    from: "F_E_G.93@hotmail.com",
    subject: "Recuperación de cuenta Lost Pet App",
    text: "Hola! tenemos nueva información",
    html: `<h1>LOST PETS APP</h1>Tu nueva contraseña provisoria para iniciar sessión en la app es: <strong>${newPassWord}</strong></p><p>Recuerda que puedes volver a loguearte y entrar a la pagina "Mis Datos" para cambiar de contraseña.</p><p>Saludos!</p>`,
  };
  const mailsentRes = await sgMail.send(messageToSend);
  console.log(mailsentRes);
  return { message: "Información enviada!", response: mailsentRes };
}
