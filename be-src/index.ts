import * as cors from "cors";
import * as express from "express";
import * as path from "path";
const rutaRelativa = path.resolve(__dirname, "../fe-dist/index.html");
import { connectionTest } from "./models/connection";
import { index } from "./lib/algolia";

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

// ALGOLIA TEST
// CREA UNA MASCOTA DE PRUEBA
app.post("/pets", async (req, res) => {
  const { name, lat, lng, id } = req.body;

  const newComercioInAlgolia = await index.saveObject({
    objectID: id,
    name: name,
    _geoloc: {
      lat: lat,
      lng: lng,
    },
  });
  res.json(newComercioInAlgolia);
});

// OBTENER TODOS LAS MASCOTAS CERCA DE LAT/LANG
app.get("/petsbygeo", async (req, res) => {
  const params = req.query;
  const response = await index.search("", {
    aroundLatLng: `${params.lat}, ${params.long}`,
    aroundRadius: 1000,
  });

  /*   const findedIds = response.hits.map((maps) => {
    return maps.objectID;
  });

  const findedStores = await Comercio.findAll({
    where: {
      id: findedIds,
    },
  }); */

  res.json(response.hits);
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
