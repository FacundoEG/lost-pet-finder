import * as cors from "cors";
import * as express from "express";
import * as path from "path";

import { connectionTest } from "./models/connection";
import { authMiddleWare } from "./middleware/methods";
import {
  createNewUser,
  updateUser,
  getUserData,
  getUserReportedPets,
} from "./controllers/user-controller";
import {
  checkEmail,
  getToken,
  sentNewPassWordEmail,
} from "./controllers/auth-controller";
import {
  reportNewPet,
  updatePetData,
  updatePetState,
  deletePetData,
  getLostPetsByGeo,
} from "./controllers/pet-controller";
import { sentPetReport } from "./controllers/report-controller";

const rutaRelativa = path.resolve(__dirname, "../fe-dist/index.html");

// API INIT AND CONFIG
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(cors());

//
// TESTS
// TESTEA LA CONEXION A SEQUELIZE EN DEV Y PRODUCTION
app.get("/test", async (req, res) => {
  const prueba = await connectionTest();

  console.log(prueba);

  res.status(200).json({
    message: "todo ok",
    test: prueba,
    base_url: process.env.API_BASE_URL,
    secret: process.env.API_SECRET,
  });
});

// ENDPOINTS

//
// -- USERS CONTROLLER --
// CREATE NEW USER
app.post("/user", async (req, res) => {
  // SE ESPERA LA PROMESA DEL CONTROLLER
  const newUserRes: any = await createNewUser(req.body);

  // SI EL USUARIO ENVIA EL BODY VACIO RECIBE UN ERROR, SI NO RECIBE LA CONFIRMACIÓN
  if (newUserRes.error) {
    res.status(400).json(newUserRes);
  }

  if (newUserRes.message) {
    res.status(200).json(newUserRes);
  }
});

// UPDATE USER DATA
app.post("/user/data", authMiddleWare, async (req, res) => {
  // SE ESPERA LA PROMESA DEL CONTROLLER
  const updateUserRes: any = await updateUser(req.body, req.userData.id);

  // SI EL USUARIO ENVIA EL BODY VACIO RECIBE UN ERROR, SI NO RECIBE LA CONFIRMACIÓN
  if (updateUserRes.error) {
    res.status(400).json(updateUserRes);
  }

  if (updateUserRes.message) {
    res.status(200).json(updateUserRes);
  }
});

// GET USER DATA
app.get("/user/data", authMiddleWare, async (req, res) => {
  // SE ESPERA LA PROMESA DEL CONTROLLER
  const userDataResponse: any = await getUserData(req.userData.id);

  // SI EL USUARIO ENVIA EL BODY VACIO O SUS DATOS NO SON CORRECTOS, RECIBE UN ERROR
  if (userDataResponse.error) {
    res.status(400).json(userDataResponse);
  }

  // SI LOS DATOS ESTAN CORRECTOS, DEVUELVE EL TOKEN
  if (userDataResponse.userData) {
    res.status(200).json(userDataResponse);
  }
});

// GET USER REPORTED PETS
app.get("/user/pets", authMiddleWare, async (req, res) => {
  // SE ESPERA LA PROMESA DEL CONTROLLER
  const reportedPetsRes: any = await getUserReportedPets(req.userData.id);

  // SI EL USUARIO ENVIA EL BODY VACIO O SUS DATOS NO SON CORRECTOS, RECIBE UN ERROR
  if (reportedPetsRes.error) {
    res.status(400).json(reportedPetsRes);
  }

  // SI LOS DATOS ESTAN CORRECTOS, DEVUELVE EL TOKEN
  if (reportedPetsRes.reportedPets) {
    res.status(200).json(reportedPetsRes);
  }
});

//
// -- PETS CONTROLLER --
// REPORT NEW PET
app.post("/pet", authMiddleWare, async (req, res) => {
  // SE ESPERA LA PROMESA DEL CONTROLLER
  const newPetReportRes: any = await reportNewPet(req.body, req.userData.id);

  // SI EL USUARIO ENVIA EL BODY VACIO RECIBE UN ERROR, SI NO RECIBE LA CONFIRMACIÓN
  if (newPetReportRes.error) {
    res.status(400).json(newPetReportRes);
  } else {
    res.status(200).json(newPetReportRes);
  }
});

// EDIT PET DATA
app.post("/pet/:petid", authMiddleWare, async (req, res) => {
  // SE ESPERA LA PROMESA DEL CONTROLLER
  const petDataUpdate: any = await updatePetData(
    req.body,
    parseInt(req.params.petid)
  );

  // SI EL USUARIO ENVIA EL BODY VACIO RECIBE UN ERROR, SI NO RECIBE LA CONFIRMACIÓN
  if (petDataUpdate.error) {
    res.status(400).json(petDataUpdate);
  }

  if (petDataUpdate.message) {
    res.status(200).json(petDataUpdate);
  }
});

// EDIT PET STATE
app.post("/pet/state/:petid", authMiddleWare, async (req, res) => {
  // SE ESPERA LA PROMESA DEL CONTROLLER
  const petStateUpdate: any = await updatePetState(
    req.body,
    parseInt(req.params.petid)
  );

  // SI EL USUARIO ENVIA EL BODY VACIO RECIBE UN ERROR, SI NO RECIBE LA CONFIRMACIÓN
  if (petStateUpdate.error) {
    res.status(400).json(petStateUpdate);
  }

  if (petStateUpdate.message) {
    res.status(200).json(petStateUpdate);
  }
});

// DELETE PET DATA
app.delete("/pet/delete/:petid", authMiddleWare, async (req, res) => {
  // SE ESPERA LA PROMESA DEL CONTROLLER
  const deletePetRes: any = await deletePetData(parseInt(req.params.petid));

  // SI EL USUARIO ENVIA EL BODY VACIO RECIBE UN ERROR, SI NO RECIBE LA CONFIRMACIÓN
  if (deletePetRes.error) {
    res.status(400).json(deletePetRes);
  } else {
    res.status(200).json(deletePetRes);
  }
});

// OBTENER TODOS LAS MASCOTAS PERDIDAS CERCA DE LAT/LANG
app.get("/pets/getbygeo", async (req, res) => {
  const searchParams = req.query;

  // SE ESPERA LA PROMESA DEL CONTROLLER
  const petsSearchRes: any = await getLostPetsByGeo(searchParams);

  // SI EL USUARIO ENVIA EL BODY VACIO RECIBE UN ERROR, SI NO RECIBE LA CONFIRMACIÓN
  if (petsSearchRes.error) {
    res.status(400).json(petsSearchRes);
  } else {
    res.status(200).json(petsSearchRes);
  }
});

//
// -- AUTH CONTROLLER --
// AUTH EMAIL
app.post("/auth", async (req, res) => {
  // SE ESPERA LA PROMESA DEL CONTROLLER
  const emailCheckRes: any = await checkEmail(req.body);

  // SI EL USUARIO ENVIA EL BODY VACIO RECIBE UN ERROR
  if (emailCheckRes.error) {
    res.status(400).json(emailCheckRes);
  }

  // SI NO ESTA REGISTRADO DEVUELVE FALSE
  if (emailCheckRes.false) {
    res.status(404).json(emailCheckRes);
  }

  // SI ESTA REGISTRADO DEVUELVE TRUE
  if (emailCheckRes.true) {
    res.status(200).json(emailCheckRes);
  }
});

// GET TOKEN BY AUTH
app.post("/auth/token", async (req, res) => {
  // SE ESPERA LA PROMESA DEL CONTROLLER
  const authTokenResponse: any = await getToken(req.body);

  // SI EL USUARIO ENVIA EL BODY VACIO O SUS DATOS NO SON CORRECTOS, RECIBE UN ERROR
  if (authTokenResponse.error) {
    res.status(400).json(authTokenResponse);
  }

  // SI LOS DATOS ESTAN CORRECTOS, DEVUELVE EL TOKEN
  if (authTokenResponse.token) {
    res.status(200).json(authTokenResponse);
  }
});

// RECOVER PASSWORD EMAIL
app.post("/auth/recover", async (req, res) => {
  console.log(req.body);

  // SE ESPERA LA PROMESA DEL CONTROLLER
  const emailSentRes: any = await sentNewPassWordEmail(req.body);

  // SI EL USUARIO ENVIA EL BODY VACIO RECIBE UN ERROR
  if (emailSentRes.error) {
    res.status(400).json(emailSentRes);
  }

  // SI NO ESTA REGISTRADO DEVUELVE FALSE
  if (emailSentRes.message) {
    res.status(200).json(emailSentRes);
  }
});

//
// -- REPORT CONTROLLER --
// POST NEW PET REPORT
app.post("/pets/report", async (req, res) => {
  // SE ESPERA LA PROMESA DEL CONTROLLER
  const newReportRes: any = await sentPetReport(req.body);

  // SI EL USUARIO ENVIA EL BODY VACIO RECIBE UN ERROR
  if (newReportRes.error) {
    res.status(400).json(newReportRes);
  } else {
    res.status(200).json(newReportRes);
  }
});

// GET TOKEN BY AUTH
app.get("/auth/token", async (req, res) => {
  // SE ESPERA LA PROMESA DEL CONTROLLER
  const authTokenResponse: any = await getToken(req.body);

  // SI EL USUARIO ENVIA EL BODY VACIO O SUS DATOS NO SON CORRECTOS, RECIBE UN ERROR
  if (authTokenResponse.error) {
    res.status(400).json(authTokenResponse);
  }

  // SI LOS DATOS ESTAN CORRECTOS, DEVUELVE EL TOKEN
  if (authTokenResponse.token) {
    res.status(200).json(authTokenResponse);
  }
});

//
// FRONT
// EXPRESS STATIC
app.use(express.static("fe-dist"));

// RETURN TO INDEX.HTML
app.get("*", (req, res) => {
  res.sendFile(`${rutaRelativa}`);
});

//API LISTEN
app.listen(port, () => {
  console.log(`Estamos conectados al puerto: ${port}`);
});
