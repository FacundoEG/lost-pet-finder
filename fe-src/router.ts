import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));

router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/auth-page", component: "auth-page" },
  { path: "/my-data", component: "my-data-page" },
  { path: "/report-pet", component: "report-pet-page" },
  { path: "/edit-pet", component: "edit-pet-page" },
  { path: "/my-pets", component: "my-pets-page" },
]);

if (location.pathname === "/") {
  Router.go("/");
}
