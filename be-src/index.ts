import * as cors from "cors";
import * as express from "express";
import * as path from "path";
const rutaRelativa = path.resolve(__dirname, "../fe-dist/index.html");

// TESTS

// API INIT AND CONFIG
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());

// ENDPOINTS

// CREA UN PRODUCTO PIDIENDO UN TOKEN Y SE LO ASIGNA A UN USUARIO
app.get("/test", async (req, res) => {
  res.status(200).json({ message: "todo ok" });
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