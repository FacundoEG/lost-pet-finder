import "./pages/home-page";
import "./router";
import { state } from "./state";

async function main() {
  const test = await state.test();
  console.log(test);
}

main();
