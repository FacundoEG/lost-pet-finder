import { state } from "../../state";
import { nanoid } from "nanoid";
import { Router } from "@vaadin/router";

const pawbackgr = require("../../assets/paw-backgr.png");
class Auth extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    // SE INICIALIZAN LOS ESTILOS DE LA PAGE
    var style = document.createElement("style");
    style.textContent = ` 
    .welcome-container{
     background-blend-mode: soft-light;
     background-image: url(${pawbackgr});
     background-repeat: revert;
     background-size: contain;
      min-height: 82vh;
      padding: 30px 20px 70px;
      background-color: var(--page-bgc);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .data-container{
      max-width: 1000px;
      display: flex;
      align-items: center;
      flex-direction: column;
      width: 100%;
      margin: 30px auto 0px;
      }

    .form-container__title{
      margin: 30px auto;
    }

    .form-conteiner{
      width: 100%;
      max-width: 400px;
      display: flex;
      margin: 0 auto;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 25px;
    }

    .form-conteiner__input{
      width: 95%;
      border: 3px solid #2c2c2c;
      border-radius: 4px;
      height: 40px;
      padding: 0px 0px 0px 8px;
      font-size: 16px;
      font-family: "Poppins";
      font-weight: normal;
      }

    .form-conteiner__label{
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: center;
      width: 100%;
    }

    .xcaption{
      margin-left: 3px;
    }

    .email-label{
      margin-bottom: 30px;
      align-self: start;
    }

    .form-conteiner__button{
      height: 50px;
      min-width: 275px;
      border-radius: 4px;
      border: 3px solid #2c2c2c;
      background-color: var(--button1-bgc);
      color: var(--font-colorWht);
      cursor: pointer;
      }
      
    .form-conteiner__button:active{
     background-color: var(--button-active)
    }
      
    .form-botton{
      margin-top: 20px;
    }

      
     @media (min-width: 500px){
       .form-conteiner__button{
        width: 100%;
        max-width: 335px;
       }
     }

     @media (min-width: 500px){
      .form-conteiner__input{
       width: 100%;
      }
    }
    `;
    this.shadow.appendChild(style);
  }

  addListeners() {
    const dataContainer = this.shadow.querySelector(".data-container");
    const mainForm: HTMLFormElement =
      this.shadow.querySelector(".form-conteiner");
    mainForm.addEventListener("submit", async (e: any) => {
      e.preventDefault();
      const emailValue = e.target.email.value;
      const emailData = { email: emailValue };

      // SE RENDERIZA EL ICONO DE ESPERA
      dataContainer.innerHTML = `<x-loader></x-loader>`;

      // SE RECIBE LA RESPUESTA DEL CHEQUEO DEL EMAIL
      const checkResponse = await state.emailCheck(emailData);

      // SI FALTAN DATOS DEL FORM
      if (checkResponse.error) {
        dataContainer.innerHTML = `<error-text>${checkResponse.error}</error-text>`;
        state.setEmail(emailValue);
      }

      // SI EL USUARIO NO ESTA REGISTRADO
      if (checkResponse.false) {
        dataContainer.innerHTML = `<error-text>${checkResponse.false}</error-text>`;
        state.setEmail(emailValue);
        this.renderNewUser();
      }

      // SI EL ESTA REGISTRADO
      if (checkResponse.true) {
        dataContainer.innerHTML = `<x-p-bold>${checkResponse.true}</x-p-bold>`;
        state.setEmail(emailValue);
        this.renderPassAuth();
      }
    });
  }

  // LISTENERS DEL FORM PARA ENVIAR LA CONTRASEÑA
  addPassWordListeners() {
    const dataContainer = this.shadow.querySelector(".data-container");
    const mainForm: HTMLFormElement =
      this.shadow.querySelector(".form-conteiner");

    // FORM SUBMIT EVENT
    mainForm.addEventListener("submit", async (e: any) => {
      e.preventDefault();

      // SE PIDE EL EMAIL
      const userEmail = state.getEmail();

      // SE GUARDA CAPTURA LA CONTRASEÑA Y SE GUARDA UN NANO ID PARA REPRESENTARLA LUEGO
      const passwordValue = e.target.password.value;
      const nano = nanoid(passwordValue.length);
      state.setNano(nano);

      // SE FORMATEA LA DATA PARA ENVIAR AL ENDOPOINT
      const authData = { email: userEmail, password: passwordValue };
      const authPromise = await state.authToken(authData);

      // SE RENDERIZA EL ICONO DE ESPERA
      dataContainer.innerHTML = `<x-loader></x-loader>`;

      // SI EL USUARIO SE AUTENTICA BIEN SE LE DEVUELVE EL TOKEN Y SIGUE A LA PROXIMA PAGINA
      if (authPromise.token) {
        state.setToken(authPromise.token);
        const cs = state.getState();
        const route = cs.userData.pageToGo.toString();

        const userDataResponse = await state.getUserData();
        const userName = userDataResponse.userData.name;
        state.setUserName(userName);
        Router.go(route);
      }

      // SI OCURRE UN ERROR AL AUTENTICAR, SE LE AVISA AL USUARIO
      if (authPromise.error) {
        console.log(authPromise.error);
        dataContainer.innerHTML = `<error-text>${authPromise.error}</error-text>`;
      }
    });
  }

  // LISTENERS DEL FORM PARA CREAR NUEVO USUARIO
  addNewUserListeners() {
    const dataContainer = this.shadow.querySelector(".data-container");
    const mainForm: HTMLFormElement =
      this.shadow.querySelector(".form-conteiner");

    // FORM SUBMIT LISTENER
    mainForm.addEventListener("submit", async (e: any) => {
      e.preventDefault();
      // SE PIDE EL EMAIL
      const userEmail = state.getEmail();

      // VALUES
      const nameValue = e.target.name.value;
      const passValue = e.target.password.value;
      const repeatedPassValue = e.target.passwordRepeat.value;

      // SE REVISA QUE LAS CONTRASEÑAS COINCIDAN
      if (passValue !== repeatedPassValue) {
        dataContainer.innerHTML = `
        <error-text>Las contraseñas ingresadas no coinciden</error-caption>
        `;
      } else {
        // SE RENDERIZA EL ICONO DE ESPERA
        dataContainer.innerHTML = `<x-loader></x-loader>`;

        // SE FORMATEA LA DATA PARA CREAR AL USUARIO
        const newUserData = {
          name: nameValue,
          email: userEmail,
          password: passValue,
        };

        // PROMESA DE CREACIÓN DE USUARIO
        const newUserPromise = await state.createNewUser(newUserData);

        // SI EL USUARIO SE CREA CORRECTAMENTE
        if (newUserPromise.message) {
          dataContainer.innerHTML = `<x-caption>${newUserPromise.message}</x-caption>
          `;

          // SE FORMATEA LA DATA PARA ENVIAR EL AUTH Y RECIBIR EL TOKEN
          const authData = {
            email: userEmail,
            password: passValue,
          };

          // SE ESPERA LA PROMESA DE AUTENTICAR
          const authPromise = await state.authToken(authData);

          // SI SE RECIBE SU TOKEN, SE AGREGA LA DATA AL STATE Y SE CONTINUA LA RUTA QUE DEBIA
          if (authPromise.token) {
            state.setToken(authPromise.token);
            state.setNano(newUserPromise.nano);
            state.setUserName(nameValue);
            const cs = state.getState();
            const route = cs.userData.pageToGo.toString();
            setTimeout(() => {
              Router.go(route);
            }, 3000);
          }

          // SI OCURRE UN ERROR AL AUTENTICAR, SE LE AVISA AL USUARIO
          if (authPromise.error) {
            console.log(authPromise.error);
            dataContainer.innerHTML = `<error-text>${authPromise.error}</error-text>`;
          }
        }

        // SI OCURRE ALGUN ERROR AL CREAR AL USUARIO, SE LE AVISA
        if (newUserPromise.error) {
          dataContainer.innerHTML = `
        <error-text>${newUserPromise.error}</error-text>
        `;
        }
      }
    });
  }

  // SE CREA EL CONNECTED CALLBACK
  connectedCallback() {
    // RENDERIZA LA PAGE
    this.render();
  }

  // SE RENDERIZA LA PAGE
  render() {
    //SE CREA EL DIV DONDE SE ALOJARA LA PAGE
    const mainPage = document.createElement("main");
    mainPage.classList.add("welcome-container");
    mainPage.innerHTML = `
    <form class="form-conteiner">
    <x-title class="form-container__title">Ingresar</x-title>
    <label class="form-conteiner__label">
    <x-caption class="xcaption">Email</x-caption>
    <input class="form-conteiner__input" type=text" name="email">
    </label> 
    <button class="form-conteiner__button" type="submit"><x-p-bold>Siguiente</x-p-bold></button>
    </form>
    <div class="data-container"></div>

 `;
    this.shadow.appendChild(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }

  // SE RENDERIZA EL FORM DE AUTENTICACIÓN
  renderPassAuth() {
    //SE CREA EL DIV DONDE SE ALOJARA LA PAGE
    const mainPage = this.shadow.querySelector(".welcome-container");
    mainPage.innerHTML = `
    <form class="form-conteiner">
    <x-title class="form-container__title">Ingresar</x-title>
    <label class="form-conteiner__label">
    <x-caption class="xcaption">Contraseña</x-caption>
    <input class="form-conteiner__input" type="password" name="password">
    </label> 
    <x-linktext>¿Olvidaste tu contraseña?</x-linktext>
    <button class="form-conteiner__button" type="submit"><x-p-bold>Ingresar</x-p-bold></button>
    </form>
    <div class="data-container"></div>

 `;

    this.shadow.appendChild(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addPassWordListeners();
  }

  // SE RENDERIZA EL FORM PARA CREAR UN NUEVO USUARIO
  renderNewUser() {
    //SE CREA EL DIV DONDE SE ALOJARA LA PAGE
    const mainPage = this.shadow.querySelector(".welcome-container");
    mainPage.innerHTML = `

    <form class="form-conteiner">
    <x-title class="form-container__title">Registrate</x-title>
    <label class="form-conteiner__label email-label">
    <x-caption class="xcaption">Nombre</x-caption>
    <input class="form-conteiner__input nameInput" type=text" name="name">
    </label> 
    <label class="form-conteiner__label">
    <x-caption class="xcaption">Contraseña</x-caption>
    <input class="form-conteiner__input passWordInput" type="password" name="password">
    </label> 
    <label class="form-conteiner__label">
    <x-caption class="xcaption">Repetir Contraseña</x-caption>
    <input class="form-conteiner__input rPassWordInput" type="password" name="passwordRepeat">
    </label> 
    <button class="form-conteiner__button form-botton" type="submit"><x-p-bold>Guardar</x-p-bold></button>
    </form>
    <div class="data-container"></div>
 `;
    this.shadow.appendChild(mainPage);

    this.addNewUserListeners();
  }
}
customElements.define("auth-page", Auth);
