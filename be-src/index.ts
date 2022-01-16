import * as cors from "cors";
import * as express from "express";
import * as path from "path";
const rutaRelativa = path.resolve(__dirname, "../fe-dist/index.html");
import { connectionTest } from "./models/connection";

// TESTS

// API INIT AND CONFIG
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());

// ENDPOINTS

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
