import { User, Auth, Pet } from "../models/models";
import { getHashFromString } from "../middleware/methods";
import { nanoid } from "nanoid";

async function createNewUser(userData: {
  name: string;
  email: string;
  password: string;
}) {
  const { email, name, password } = userData;

  const nano = nanoid(password.length);

  // VERIFICA QUE LA DATA DEL NUEVO USUARIO TENGA TODOS LOS DATOS
  if (!userData.name || !userData.email || !userData.password) {
    return { error: "Faltan datos del usuario" };
  }

  // CREA O BUSCA AL USUARIO EN LA TABLA USERS
  const [user, userCreated] = await User.findOrCreate({
    where: { email: email },
    defaults: {
      email,
      name,
    },
  });

  // CREA O BUSCA AL USUARIO EN LA TABLA AUTH
  const [auth, authCreated] = await Auth.findOrCreate({
    where: { email: email },
    defaults: {
      email,
      password: getHashFromString(password),
      UserId: user["id"],
    },
  });

  // DEVUELVE UN MENSAJE Y UNA CONFIRMACIÓN SI EL USUARIO ES NUEVO
  return {
    message: "Tu usuario fue creado exitosamente!",
    newUser: userCreated,
    nano,
  };
}

async function updateUser(
  userData: {
    name: string;
    password: string;
  },
  userDataId: number
) {
  const { name, password } = userData;

  // SI FALTAN DATOS DEVUELVE UN ERROR
  if (!userData.name || !userData.password) {
    return { error: "Faltan datos del usuario" };
  }

  // EDITA EL NOMBRE DEL USUARIO EN LA TABLA USER
  await User.update(
    { name },
    {
      where: { id: userDataId },
    }
  );

  // EDITA EL LA CONTASEÑA DEL USUARIO EN LA TABLA AUTH
  await Auth.update(
    { password: getHashFromString(password) },
    {
      where: { UserId: userDataId },
    }
  );

  // EDITA EL NOMBRE DEL USUARIO EN LA TABLA USER
  const user = await User.findOne({
    where: { id: userDataId },
    include: Pet,
  });

  // DEVUELVE LA CONFIRMACIÓN DE ACTUALIZACIÓN DEL USUARIO
  return { message: "Tu usuario se modifico correctamente!" };
}

async function getUserData(userDataId: number) {
  // TRAE LA DATA DE LA TABLA AUTH
  const authData = await Auth.findOne({
    where: { UserId: userDataId },
  });

  // TRAE LA DATA DE LA TABLA USER
  const userData = await User.findOne({
    where: { id: userDataId },
    include: Pet,
  });

  // DEVUELVE LA DATA DE LA TABLA USERS Y AUTH
  return {
    userData,
    authData,
  };
}

async function getUserReportedPets(userDataId: number) {
  // TRAE LA DATA DE LA TABLA USER FITRANDO SOLO A LOS PETS QUE TENGAN EL STATE "PERDIDO"
  const userData = await User.findOne({
    where: { id: userDataId },
    include: [{ model: Pet, where: { state: "perdido" } }],
  });

  if (userData == null) {
    return {
      error: "Aun no reportaste mascotas perdidas",
    };
  }

  // DEVUELVE SOLAMENTE LAS MASCOTAS REPORTADAS POR EL USUARIO
  return {
    reportedPets: userData["Pets"],
  };
}

export { createNewUser, updateUser, getUserData, getUserReportedPets };
