import "./components/header";
import "./components/fonts";
import "./components/buttons";
import "./components/loader";
import "./components/petcard";
import "./pages/home-page";
import "./pages/auth";
import "./pages/my-data";
import "./pages/my-pets";
import "./pages/repot-pet";
import "./pages/edit-pet";
import "./router";
import { state } from "./state";

async function main() {
  // SE TESTEA EL ESTADO DE LA CONEXIÓN
  const test = await state.test();
  console.log("Connection test: ", test);

  // RECUPERA EL ESTADO GUARDADO EN SESSION STORAGE APENAS SE INGRESA A LA PAGE
  state.restoreState();
}

main();
