import { Report, Pet, User } from "../models/models";
import { sendReportEmail } from "../lib/sendgrid";

async function sentPetReport(reportData: {
  name: string;
  phone: string;
  message: string;
  petId: string;
}) {
  const { name, phone, message, petId } = reportData;
  // VERIFICA QUE TODOS LOS DATOS DEL REPORTE LLEGUEN CORRECTAMENTE
  if (
    !reportData.name ||
    !reportData.phone ||
    !reportData.message ||
    !reportData.petId
  ) {
    return { error: "Faltan datos para enviar el reporte" };
  }

  // BUSCA LA REFERENCIA DE LA MASCOTA EN LA TABLA PETS
  const petData = await Pet.findOne({
    where: { id: petId },
  });

  // CHEQUEA QUE EL ID DE LA MASCOTA EXISTA
  if (!petData) {
    return { error: "La mascota que estas buscando no existe" };
  }

  // EXTRAE EL ID DEL USUARIO QUE REPORTO A LA MASCOTA
  const userId = petData["UserId"];

  // EXTRAE LA DATA DEL USUARIO QUE REPORTO A LA MASCOTA
  const reporterUserData = await User.findOne({
    where: { id: userId },
  });

  // DA DE ALTA EL REPORT DENTRO Y LO RELACIONA CON EL PET
  const newReportPromise: Report = await Report.create({
    name,
    phone,
    message,
    PetId: petId,
  });

  // SE FORMATEA LA DATA PARA ENVIAR EL EMAIL
  const emailData = {
    name,
    phone,
    message,
    petName: petData["name"],
    petReporterEmail: reporterUserData["email"],
    petReporterName: reporterUserData["name"],
  };

  // SE ENVIA LA PROMESA DE ENVIO DE EMAIL
  const promiseRes = await sendReportEmail(emailData);

  // SI EL MAIL SE ENVIA CORRECTAMENTE, DEVUELVE LA RESPUESTA POR MENSAJE
  if (promiseRes.response) {
    return {
      message: "Información enviada!",
    };
  }
}

export { sentPetReport };
