import "./pages/home-page";
import "./router";
import { state } from "./state";

async function main() {
  const test = await state.test();
  const algoliaTest = await state.algoliaTest();
  console.log("Connection test: ", test);
  console.log("Algolia Test: ", algoliaTest);
}

main();
