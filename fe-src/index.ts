import "./components/header";
import "./components/fonts";
import "./components/buttons";
import "./pages/home-page";
import "./pages/auth";
import "./pages/my-data";
import "./pages/my-pets";
import "./pages/repot-pet";
import "./router";
import { state } from "./state";

async function main() {
  const test = await state.test();
  const algoliaTest = await state.algoliaTest();
  console.log("Connection test: ", test);
  console.log("Algolia Test: ", algoliaTest);
}

main();
