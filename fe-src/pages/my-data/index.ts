const pawBackground = require("../../assets/paw-backgr.png");
import { state } from "../../state";
import { nanoid } from "nanoid";
import * as crypto from "crypto";

class MyData extends HTMLElement {
  shadow: ShadowRoot;
  userData: any;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    // SE INICIALIZAN LOS ESTILOS DE LA PAGE
    var style = document.createElement("style");
    style.textContent = ` 

    .welcome-container{
     background-blend-mode: soft-light;
     background-image: url(${pawBackground});
     background-repeat: revert;
     background-size: contain;
     min-height: 90vh;
      padding: 30px 20px 70px;
      background-color: var(--page-bgc);
      display: flex;
      flex-direction: column;
      align-items: center;
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

    .data-container{
      max-width: 1000px;
      display: flex;
      align-items: center;
      flex-direction: column;
      width: 100%;
      margin: 30px auto 0px;
      }

      @media (min-width: 900px){
        .data-container {
        justify-content: center;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 5%;
        }
      }
    `;
    this.shadow.appendChild(style);
  }

  // SE AGREGAN LOS LISTENERS DE LA PAGE
  addListeners() {
    const dataContainer = this.shadow.querySelector(".data-container");
    const mainForm: HTMLFormElement =
      this.shadow.querySelector(".form-conteiner");

    // FORM SUBMIT LISTENER
    mainForm.addEventListener("submit", async (e: any) => {
      e.preventDefault();

      // VALUES
      const nameValue = e.target.name.value;
      const passValue = e.target.password.value;
      const repeatedPassValue = e.target.passwordRepeat.value;

      // SE REVISA QUE LAS CONTRASEÑAS INGRESADAS COINCIDAN
      if (passValue !== repeatedPassValue) {
        dataContainer.innerHTML = `
      <error-text>Las contraseñas ingresadas no coinciden</error-caption>
      `;
      }

      // CHEQUEA QUE EL USUARIO NO VUELVA A PONER LA CONTRASEÑA INGRESADA ANTERIORMENTE
      if (passValue === repeatedPassValue) {
        const passWordHashed = this.getHashFromString(passValue);

        const userDataResponse = await state.getUserData();
        const userHashedPass = userDataResponse.authData["password"];

        if (passWordHashed === userHashedPass) {
          dataContainer.innerHTML = `
          <error-text>Debes poner una contraseña diferente a la actual</error-caption>
          `;
        } else {
          // CARGA EL LOADER
          dataContainer.innerHTML = `
        <x-loader>Debes poner una contraseña diferente a la actual</x-loader>
        `;

          // FORMATEA LA DATA PARA LA PROMESA
          const newUserData = {
            name: nameValue,
            password: passValue,
          };

          // PROMESA DE ACTUALIZACIÓN DE USUARIO
          const userUpdatePromise = await state.updateUserData(newUserData);

          // SI LA PROMESA SE RESUELVE BIEN, DEVUELVE UN MENSAJE Y A LOS 1,5 SEGUNDOS CAMBIA EL STATE
          if (userUpdatePromise.message) {
            dataContainer.innerHTML = `
          <x-caption>${userUpdatePromise.message}</x-caption>
          `;

            setTimeout(() => {
              const nano = nanoid(passValue.length);
              state.setUserName(nameValue);
              state.setNano(nano);
            }, 1500);
          }

          // SI LA PROMESA DEVUELVE UN ERROR SE LE AVISA AL USUARIO
          if (userUpdatePromise.error) {
            dataContainer.innerHTML = `
          <error-text>${userUpdatePromise.error}</error-caption>
          `;
          }
        }
      }
    });
  }

  // DEVUELVE EL HASH PARA COMPARAR LAS PASSWORDS
  getHashFromString(text: string) {
    return crypto.createHash("sha256").update(text).digest("hex");
  }

  // ESTA FUNCION TRAE LA DATA PARA RELLENAR EL INPUT
  importUserInputData() {
    // SE TRAE LA DATA DEL STATE
    const cs = this.userData;
    const userName = cs.name;
    const userNano = cs.nanoid;

    // SE DECLARAN LAS REFERENCIAS
    const mainForm: HTMLFormElement =
      this.shadow.querySelector(".form-conteiner");
    const nameInput: HTMLInputElement = mainForm.querySelector(".nameInput");
    const passInput: HTMLInputElement =
      mainForm.querySelector(".passWordInput");
    const rPassInput: HTMLInputElement =
      mainForm.querySelector(".rPassWordInput");

    // SE AGREGAN LA DATA A LOS INPUTS
    nameInput.value = userName;
    passInput.value = userNano;
    rPassInput.value = userNano;
  }

  // SE CREA EL CONNECTED CALLBACK
  connectedCallback() {
    state.subscribe(() => {
      const currentState = state.getState();
      this.userData = currentState.userData;
      this.shadow.children[1].remove();
      this.render();
    });
    // PIDE LA DATA DEL STATE RENDERIZA LA PAGE
    const currentState = state.getState();
    this.userData = currentState.userData;
    this.render();
  }

  render() {
    //SE CREA EL DIV DONDE SE ALOJARA LA PAGE
    const mainPage = document.createElement("main");
    mainPage.classList.add("welcome-container");
    //SE RENDERIZA

    mainPage.innerHTML = `

    <form class="form-conteiner">
    <x-title class="form-container__title">Mis Datos</x-title>
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

    // TRAE LA DATA DEL USUARIO PARA LOS INPUTS DESDE EL STATE
    this.importUserInputData();

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("my-data-page", MyData);
