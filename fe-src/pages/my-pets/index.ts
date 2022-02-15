import { state } from "../../state";

const pawfondo = require("../../assets/paw-backgr.png");

class MyPets extends HTMLElement {
  shadow: ShadowRoot;
  petsData: any;
  stateData: any;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    // SE INICIALIZAN LOS ESTILOS DE LA PAGE
    var style = document.createElement("style");
    style.textContent = ` 

    .welcome-container{
      background-blend-mode: soft-light;
      background-image: url(${pawfondo});
      background-repeat: revert;
      background-size: contain;
      min-height: 82vh;
      padding: 30px 20px 70px;
      background-color: var(--page-bgc);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .main-container{
      width: 100%;
      max-width: 400px;
      display: flex;
      margin: 0 auto;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 22px;
    }
    
    .main-container__title{
      margin: 30px auto;
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

  // AGREGA LOS LISTERS DE LA PAGE
  addListeners() {
    const dataContainer = this.shadow.querySelector(".data-container");

    // SE RENDERIZA EL ICONO DE ESPERA
    dataContainer.innerHTML = `<x-loader></x-loader>`;

    // CREA UN FLAG PARA AVISARLE A LA PAGE CUANDO SE CARGUE EL TOKEN
    const tokenFlag = setInterval(async () => {
      const cs = state.getState();
      const haveTokenFlag = cs.userData.token !== null;

      // SI SE CARGO EL TOKEN EN EL STATE SE CORTA EL INTERVALO Y SE CONSULTA AL BACKEND
      if (haveTokenFlag == true) {
        clearInterval(tokenFlag);
        const reportedPetsPromise = await state.getReportedPetsByUser();

        // SI EL USUARIO NO REPORTO MASOTAS PERDIDAS, SE LE AVISA POR LA RESPUESTA
        if (reportedPetsPromise.error) {
          dataContainer.innerHTML = `
      <x-caption>${reportedPetsPromise.error}</x-caption>
      `;
        }

        // SI EL USUARIO REPORTO MASCOTAS PERDIDAS, SE RENDERIZAN LOS PETS
        if (!reportedPetsPromise.error) {
          // SE RENDERIZA EL ICONO DE ESPERA
          dataContainer.innerHTML = `<x-loader></x-loader>`;

          // SI HAY MASCOTAS SE CONVIERTE EL RESULTADO EN UN ARRAY
          const petsArray = Object.values(reportedPetsPromise)[0];

          // LIMPIA EL CONTENEDOR DONDE IRA LA DATA
          this.cleanDataContainer();

          // SE RENDERIZAN LAS CARDS DE LAS MASCOTAS SI LAS HAY, SI NO SE DEJA UN MENSAJE
          this.renderPetCards(petsArray);
        }
      }
    }, 100);
  }

  // SE LIMPIA EL CONTENEDOR DONDE IRA LA DATA
  cleanDataContainer() {
    const dataContainer = this.shadow.querySelector(".data-container");
    while (dataContainer.firstChild) {
      dataContainer.firstChild.remove();
    }
  }

  // SE RENDERIZAN LAS CARDS CON LAS MASCOTAS PERDIDAS
  renderPetCards(petsData) {
    const dataContainer = this.shadow.querySelector(".data-container");
    for (const pet of petsData) {
      const petName = pet.name;
      const petId = pet.id;
      const petUbication = pet.ubication;

      const petCardContainer = document.createElement("div");

      petCardContainer.innerHTML = `
    <lost-pet name=${petName} ubication=${petUbication} petId=${petId}></lost-pet>
    `;
      dataContainer.appendChild(petCardContainer);
    }
  }

  // SE CREA EL CONNECTED CALLBACK
  connectedCallback() {
    this.render();
  }
  render() {
    //SE CREA EL DIV DONDE SE ALOJARA LA PAGE
    const mainPage = document.createElement("main");
    mainPage.classList.add("welcome-container");
    mainPage.innerHTML = `
    <section class="main-container">
    <x-title class="main-container__title">Mis mascotas reportadas</x-title>
    </section>
    <div class="data-container"></div>
 `;

    this.shadow.appendChild(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("my-pets-page", MyPets);
