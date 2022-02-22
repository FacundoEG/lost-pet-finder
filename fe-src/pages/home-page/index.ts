import { state } from "../../state";
const pawBackground = require("../../assets/paw-backgr.png");

class Home extends HTMLElement {
  shadow: ShadowRoot;
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
    
    .main-container__title{
      margin: 30px auto;
    }

    .main-conteiner{
      max-width: 400px;
      display: flex;
      margin: 0 auto;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 22px;
    }

    .data-container{
    max-width: 1000px;
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    margin: 50px auto 0px;
    }

    @media (min-width: 900px){
      .data-container {
      justify-content: center;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 5%;
      }
    }

    .report-modal {
      display: none;
      position: fixed; 
      z-index: 1; 
      left: 0;
      top: 0;
      width: 100%; 
      height: 100%; 
      overflow: auto; 
      background-color: rgba(0,0,0,0.4); 
    }

    .report-modal__closebutton{
      width: 40px;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0px;
      display: flex;
      align-items: center;
      align-self: end;
      margin: auto 0px auto auto
    }

    .modal-content__img{
      width: 40px;
     }

    .modal-content__img:active {
      filter: invert(59%) sepia(35%) saturate(1935%) hue-rotate(224deg) brightness(98%) contrast(88%)
    }

    .active-modal {
      display: flex;
      animation: entrance 1.0s ease 0s 1 normal forwards;
    }

    .desactive-modal {
      display: flex;
      animation: exit 1.0s ease 0s 1 normal forwards;
    }
    
    .modal-content {
      max-width: 500px;
      background-color: var(--header-bgc);
      margin: auto;
      padding: 20px 20px 40px;
      border: 1px solid #888;
      width: 80%;
    }

    @keyframes entrance {
      0% {
        opacity: 0;
      }
    
      100% {
        opacity: 1;
      }
    }

    @keyframes exit {
      0% {
        opacity: 1;
      }
    
      100% {
        opacity: 0;
      }
    }

    .form-container__title{
      margin: 20px auto;
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

    .textarea{
      height: 100px;
      padding-top: 5px;
      resize: none
    }

    .xcaption{
      margin-left: 3px;
    }

    .form-conteiner__button{
      min-height: 50px;
      min-width: 265px;
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

    @media (max-width: 500px){
      .modal-content{
      padding: 20px 10px
      }
    }

    @media (max-width: 500px){
      .form-conteiner{
      gap: 5px;
      }
    }
    `;
    this.shadow.appendChild(style);
  }

  addListeners() {
    const mainButton: HTMLButtonElement = this.shadow.querySelector(
      ".welcome-container__button"
    );
    const dataContainer = this.shadow.querySelector(".data-container");

    // ESCUCHA EL EVENTO CLICK DEL BOTON DE LA UBICACIÓN
    mainButton.addEventListener("click", async (e) => {
      e.preventDefault();

      // SE RENDERIZA EL ICONO DE ESPERA
      dataContainer.innerHTML = `<x-loader></x-loader>`;

      // CONSULTA LA GEOLOCACIÓN
      navigator.geolocation.getCurrentPosition(async (geoPosition) => {
        const lat = geoPosition.coords.latitude;
        const lng = geoPosition.coords.longitude;

        // AGREGA LA GEOLOCACIÓN AL STATE
        state.setCurrentGeoLocation(lat, lng);

        // PIDE LAS MASCOTAS PERDIDAS AL BACKEND POR EL STATE
        const petsData = await state.getLostPetsByGeo();

        // LIMPIA EL CONTENEDOR DONDE IRA LA DATA
        this.cleanDataContainer();

        // SI NO SE ENCUENTRAN MASCOTAS, SE AVISA POR EL DATA CONTAINER
        if (petsData.findedPets.length == 0) {
          dataContainer.innerHTML = `
          <error-text>No se encontraron mascotas en el area</error-text>
          `;
        }
        // SI SE ENCUENTRA DATA DE LAS MASCOTAS PERDIDAS, SE CREAN LAS PETS CARDS
        this.renderPetCards(petsData);
      });
    });
  }

  // SE CREA EL CONNECTED CALLBACK
  connectedCallback() {
    // RENDERIZA LA PAGE
    this.render();
  }

  // SE RENDERIZAN LAS CARDS CON LAS MASCOTAS PERDIDAS
  renderPetCards(petsData) {
    const dataContainer = this.shadow.querySelector(".data-container");
    for (const pet of petsData.findedPets) {
      const { name, id, ubication, photoUrl } = pet;
      const petCardContainer = document.createElement("div");

      petCardContainer.innerHTML = `
      <lost-pet name="${name}" ubication="${ubication}" petId=${id} photo=${photoUrl}></lost-pet>
      `;
      dataContainer.appendChild(petCardContainer);
    }
  }

  // SE LIMPIA EL CONTENEDOR DONDE IRA LA DATA
  cleanDataContainer() {
    const dataContainer = this.shadow.querySelector(".data-container");
    while (dataContainer.firstChild) {
      dataContainer.firstChild.remove();
    }
  }

  render() {
    //SE CREA EL DIV DONDE SE ALOJARA LA PAGE
    const mainPage = document.createElement("main");
    mainPage.classList.add("welcome-container");

    // SE AGREGA EL HTML AL CONTENEDOR PRINCIPAL
    mainPage.innerHTML = `
    <section class="modal-container"></section>
    <section class="main-conteiner">
    <x-title class="main-container__title">Mascotas perdidas cerca tuyo</x-title>
    <x-caption>Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</x-caption>
    <x-button class="welcome-container__button">Dar mi ubicación</x-button> 
    </section>
    <div class="data-container"></div>
 `;

    this.shadow.appendChild(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("home-page", Home);
