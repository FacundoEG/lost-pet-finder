import { Router } from "@vaadin/router";
import { state } from "../../state";

const petPaw = require("../../assets/pet-paw.png");
const xMark = require("../../assets/x-mark-white.png");
const hamburguer = require("../../assets/menu-icon.png");
const user = require("../../assets/user.png");

class HeaderComp extends HTMLElement {
  shadow: ShadowRoot;
  userEmail: string;
  userToken: string;
  constructor() {
    super();
    this.userEmail = "F_E_G.93@hotmail.com";
    this.shadow = this.attachShadow({ mode: "open" });

    var style = document.createElement("style");
    style.textContent = `
     * {
       box-sizing: border-box;
      }

     .header-comp{
       width: 100%;
       display:flex;
       background-color: var(--header-bgc);
       padding: 13px;
       justify-content: space-between;
       border-bottom: 2px solid #2c2c2c;
     }

     
     .paw-icon,.hamburger-menu__button,.header-comp__window-closebutton{
       width: 40px;
       cursor: pointer;
       background: none;
       border: none;
       padding: 0px;
       display: flex;
       align-items: center;
     }

     img:active {
      filter: invert(59%) sepia(35%) saturate(1935%) hue-rotate(224deg) brightness(98%) contrast(88%)
    }

     .paw-icon__img,.hamburger-menu__img,.header-comp__window-closebutton__img{
      width: 40px;
     }

     .paw-icon__img{
      margin-top: 6px
     }

     .header-comp__window-closebutton{
      align-self: end;
      margin: 15px 15px 0px;
     }

     .header-comp__window-menu {
      width:100%;
      border-radius: 4px;
      display:flex;
      flex-direction:column;
      align-items:center;
      position:fixed;
      background-color: var(--header-bgc);
      top: 0;
      transition: right 1s ease-in-out;
      right: -100%;
      border: 1px solid #2c2c2c;
    } 
    
    .active{
      right: 0;
    }

    .header-comp__window-menu-link {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 10px 0px 30px;
      width: 100%;
    }

     .header-comp__window-menu-link > a{
      color: white;
      text-decoration: none;
      font-size: 23px;
      padding: 15px;
      width: 100%;
      text-align: center;
      font-weight: bold;
      cursor: pointer;
    }
    
    .header-comp__window-menu-link > a:hover {
      background-color: rgba(255, 255, 255, 0.2);
      color: var(--font-hover)
    }

    .user-data__container{
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding: 20px;
    }

    .user-data__img{
      width: 20px;
      height: 20px;
    }

    .user-data__box{
      display:flex;
      gap: 8px;
      align-items: center;
    }
    
    .user-data__container > span{
     font-size: 20px;
     color: var(--font-colorWht)
    }

    .user-data__container > a{
      font-size: 18px;
      padding: 5px;
      color: var(--font-link-color);
      cursor: pointer;
     }

    .p:hover{
      text-decoration-line: underline;
      color: var(--button-active)
      }

     @media (min-width: 700px) {
      .header-comp__window-menu {
        width: 400px;
        left: inherit;
      }
    }
    `;
    this.shadow.appendChild(style);
  }

  // ESTA FUNCIÓN HACE TOGGLE A LA CLASE "ACTIVE" DEL MENU HAMBURGUESA
  toggleAction() {
    const headerCompRef = this.shadow.children[1];
    const windowMenu: HTMLDivElement = headerCompRef.querySelector(
      ".header-comp__window-menu"
    );
    windowMenu.classList.toggle("active");
  }

  // GENERA EL TOGGLE CON LOS ICONOS DEL HEADER-COMP
  menuToggleListeners() {
    const headerCompRef = this.shadow.children[1];
    const hamburguerButtonEl: HTMLButtonElement = headerCompRef.querySelector(
      ".hamburger-menu__button"
    );
    const windowCloseButtonEl: HTMLButtonElement = headerCompRef.querySelector(
      ".header-comp__window-closebutton"
    );

    hamburguerButtonEl.addEventListener("click", () => this.toggleAction());
    windowCloseButtonEl.addEventListener("click", () => this.toggleAction());
  }

  // CHEQUEA QUE EL STATE TENGA EMAIL Y TOKEN SI NO TE ENVIA A AUTH-PAGE
  authRedirect() {
    const cs = state.getState();
    const { email, token, pageToGo } = cs.userData;
    const noEmailorToken = email == null || token == null;

    if (noEmailorToken === true) {
      Router.go("/auth-page");
    }

    if (noEmailorToken === false) {
      const route = pageToGo.toString();
      Router.go(route);
    }
  }

  // LISTENERS DEL COMPONENTE
  addListeners() {
    // ELEMENTS REFS
    const headerCompRef = this.shadow.children[1];
    const pawIconLink = headerCompRef.querySelector(".paw-icon__img");
    const myPetsLink = headerCompRef.querySelector(".my-pets");
    const myDataLink = headerCompRef.querySelector(".my-data");
    const reportPetLink = headerCompRef.querySelector(".report-pet");
    const closeSessionLink = headerCompRef.querySelector(".close-session");

    // CIERRA EL MENU HAMBURGUESA SI SE CLIQUEA EL ICONO DE LA PATA (SOLAMENTE SI ESTA ABIERTO PREVIAMENTE)
    pawIconLink.addEventListener("click", () => {
      const windowMenu: HTMLDivElement = headerCompRef.querySelector(
        ".header-comp__window-menu"
      );
      if (windowMenu.classList.contains("active")) {
        this.toggleAction();
      }
    });

    // CHEQUEA QUE EL USUARIO TENGA EMAIL Y TOKEN PARA REDIRIGIR A LA PAGINA ELEGIDA
    myDataLink.addEventListener("click", () => {
      this.toggleAction();
      state.setPageToGo("/my-data");
      this.authRedirect();
    });
    myPetsLink.addEventListener("click", () => {
      this.toggleAction();
      state.setPageToGo("/my-pets");
      this.authRedirect();
    });
    reportPetLink.addEventListener("click", () => {
      this.toggleAction();
      state.setPageToGo("/report-pet");
      this.authRedirect();
    });

    // SI EL USUARIO ESTA REGISTRADO, PERMITE CERRAR SESSIÓN Y SI NO LO ESTA LO DEJA INGRESAR
    closeSessionLink.addEventListener("click", () => {
      // SI EL USUARIO ES UN INVITADO Y NO SE REGISTRO
      if (this.userEmail === "Invitado") {
        this.toggleAction();
        state.setPageToGo("/");
        Router.go("/auth-page");
      }

      // SI EL USUARIO ESTA REGISTRADO
      if (this.userEmail !== "Invitado") {
        this.toggleAction();
        state.disconnectUser();
        Router.go("/");
      }
    });
  }

  // RECARGA LA DATA CUANDO CAMBIA EL STATE
  connectedCallback() {
    state.subscribe(() => {
      const csToken = state.getToken();
      const csEmail = state.getEmail();
      this.userEmail = csEmail || "Invitado";
      this.userToken = csToken || null;
      this.shadow.children[1].remove();
      this.render();
    });
    // PIDE LA DATA DEL STATE RENDERIZA LA PAGE
    const csToken = state.getToken();
    const csEmail = state.getEmail();
    this.userEmail = csEmail || "Invitado";
    this.userToken = csToken || null;
    this.render();
  }

  render() {
    //SE CREA EL DIV DONDE SE ALOJARA LA PAGE
    const mainPage = document.createElement("header");
    mainPage.classList.add("header-comp");

    mainPage.innerHTML = `
    <a class="paw-icon" href="/">
    <img src=${petPaw} class="paw-icon__img"></img>
    </a>

    <div class="hamburger-menu">
     <nav class="header-comp__window-menu">
     <button class="header-comp__window-closebutton">
      <img src=${xMark} class="header-comp__window-closebutton__img">
     </button>

     <div class="header-comp__window-menu-link">
     <a class="my-data"><x-subtitle>Mis datos</x-subtitle></a>
     <a class="my-pets"><x-subtitle>Mis mascotas reportadas</x-subtitle></a>
     <a class="report-pet"><x-subtitle>Reportar mascotas</x-subtitle></a>

     <div class="user-data__container">
     <div class="user-data__box">
     <img src=${user} class="user-data__img"></img>
     <x-parrafo>${
       this.userEmail && this.userToken !== null ? this.userEmail : "Invitadx"
     }</x-parrafo>
     </div>
     <a class="close-session"><x-linktext>${
       this.userEmail !== "Invitado" ? "CERRAR SESIÓN" : "INICIAR SESIÓN"
     }</x-linktext></a>
     </div>
     </nav>
    </div>
    
    <button class="hamburger-menu__button">
    <img src=${hamburguer} class="hamburger-menu__img"></img>
    </button>
    </div>
    `;

    this.shadow.appendChild(mainPage);

    // EFECTO DE TOGGLE EN EL MENU
    this.menuToggleListeners();

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("header-comp", HeaderComp);
