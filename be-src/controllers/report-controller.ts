import { Report, Pet, User } from "../models/models";
const ADMIN_EMAIL = "F_E_G.93@hotmail.com";

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

  // DEVUELVE LA DATA DE LA MASCOTA REPORTADA
  return {
    respuesta: "El reporte fue enviado correctamente",
    name,
    phone,
    message,
    petName: petData["name"],
    petReporterName: reporterUserData["name"],
    petReporterEmail: reporterUserData["email"],
    newReportPromise,
  };
}

export { sentPetReport };
