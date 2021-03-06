const pawback = require("../../assets/paw-backgr.png");
import { mapboxClient, MAPBOX_TOKEN } from "../../lib/mapbox";
import * as mapboxgl from "mapbox-gl";
import Dropzone from "dropzone";
import { state } from "../../state";

class ReportPet extends HTMLElement {
  shadow: ShadowRoot;
  searchData: any;
  map: any;
  photoUrl: any;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.searchData = null;
    this.photoUrl = null;
    // SE INICIALIZAN LOS ESTILOS DE LA PAGE
    var style = document.createElement("style");
    style.textContent = `  

    .welcome-container{
      background-blend-mode: soft-light;
      background-image: url(${pawback});
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
      gap: 28px;
    }

    .form-conteiner__input{
      width: -webkit-fill-available;
      border: 3px solid #2c2c2c;
      border-radius: 4px;
      height: 40px;
      padding: 0px 0px 0px 8px;
      font-size: 16px;
      font-family: "Poppins";
      font-weight: normal;
      }

    .form-conteiner__label{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: start;
      justify-content: center;
      width: 100%;
    }

    .xcaption{
      margin-left: 3px;
    }

    .reference{
      margin-top: 10px;
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
      
      
    .foto-input{
      padding: 10px 20px;
      display: flex;
      color: white;
      min-width: 275px;
      min-height: 50px;
      border: 3px solid #2c2c2c;
      background-color: #592979;
      border-radius: 4px;
      cursor: pointer;
      font-family: "Poppins", sans-serif;
      font-weight: bold;
      font-size: 16px;
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }

    .dz-image img {
        border-radius: 2px;
        border: #ffffff8a 1px solid;
    }

    .foto-input .dz-success-mark,.dz-error-mark,.dz-details{
      display:none
    }
 

     .form-conteiner__map{
      width: -webkit-fill-available; 
      height: 200px;
      margin: 0px 0px 20px 0px; 
      border-radius: 4px; 
      border: 3px solid #2c2c2c;
     }
     
      
    .form-botton{
      margin-top: 20px;
    }

    .button2{
     background-color: var(--button2-bgc)
    }

     .button3{
    background-color: var(--button3-bgc)
    }

      
     @media (min-width: 500px){
       .form-conteiner__button{
        width: 100%;
        max-width: 335px;
       }
     }

     @media (min-width: 500px){
      .form-conteiner__input{
       width: -webkit-fill-available
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
    `;
    this.shadow.appendChild(style);
  }

  // INICIA EL MAPA EN EL CONTENEDOR
  initMap() {
    const mapContainer = this.shadow.querySelector(".form-conteiner__map");
    mapboxgl.accessToken = MAPBOX_TOKEN;
    return new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
    });
  }

  // INICIA DROPZONE Y GUARDA LA DATA DE LA URL SUBIDA EN EL ATRIBUTO PHOTO URL
  addPhotoListener() {
    const dropzone = this.shadow.querySelector(".foto-input");
    const myDropzone = new Dropzone(dropzone, {
      url: "/falsa",
      autoProcessQueue: false,
      thumbnailWidth: 250,
      thumbnailHeight: 150,
    });
    myDropzone.on("thumbnail", (file) => {
      this.photoUrl = file.dataURL;
    });
  }

  addListeners() {
    // SE DECLARAN LAS REFERENCIAS QUE SE USARAN
    const dataContainer = this.shadow.querySelector(".data-container");
    const mainForm: HTMLFormElement =
      this.shadow.querySelector(".form-conteiner");
    const dropzone = this.shadow.querySelector(".foto-input");
    const searchButton = this.shadow.querySelector(".search-button");
    const ubicationInput: HTMLInputElement =
      mainForm.querySelector(".ubication-input");
    const cancelButton = this.shadow.querySelector(".cancel-button");

    // LISTENER DEL BOTON UBICACI??N, GUARDA LA DATA DE LA BUSQUEDA Y CREA EL MARKER
    searchButton.addEventListener("click", (e: any) => {
      e.preventDefault();
      const inputValue = ubicationInput.value;

      // SI EL INPUT DE BUSQUEDA ESTA VAC??O, SE DEVUELVE UN ERROR
      if (inputValue.trim() == "") {
        dataContainer.innerHTML = `
      <error-text>Debes escribir algo para poder generar la ubicaci??n</error-caption>
      `;
      } else {
        // SE REALIZA LA GEOBUSQUEDA
        mapboxClient.geocodeForward(
          inputValue,
          {
            country: "ar",
            autocomplete: true,
            language: "es",
          },
          // SE GUARDA LOS DATOS DE LA BUSQUIEDA EN UN ATRIBUTO SEARCHDATA
          (err, data, res) => {
            const firstResult = data.features[0];
            const lng = firstResult.geometry.coordinates[0];
            const lat = firstResult.geometry.coordinates[1];
            this.searchData = { lng, lat };

            // CREA EL MARKER EN EL MAPA
            new mapboxgl.Marker()
              .setLngLat(firstResult.geometry.coordinates)
              .addTo(this.map);
            this.map.setCenter(firstResult.geometry.coordinates);
            this.map.setZoom(14);
          }
        );
      }
    });

    // LISTENER DEL FORM, ENVIA EL FORMULARIO PARA CREAR A LA NUEVA MASCOTA
    mainForm.addEventListener("submit", async (e: any) => {
      e.preventDefault();
      const nameData = e.target.name.value;
      const ubicationData = e.target.ubication.value;

      // REVISA QUE EL USUARIO HAYA BRINDADO TODOS LOS DATOS
      if (!nameData || !ubicationData || !this.searchData || !this.photoUrl) {
        dataContainer.innerHTML = `
      <error-text>Faltan datos para realizar la busqueda</error-caption>
      `;
      } else {
        // INICIA EL LOADER
        dataContainer.innerHTML = `<x-loader></x-loader>`;

        // GUARDA LA DATA PARA LA PROMESA
        const newPetData = {
          name: nameData,
          photoUrl: this.photoUrl,
          state: "perdido",
          ubication: ubicationData,
          lat: this.searchData.lat,
          lng: this.searchData.lng,
        };

        // RECIBE LA RESPUESTA
        const newReportedPetProm = await state.reportNewPet(newPetData);

        // SI LA PROMESA SALE BIEN SE AVISA AL USER
        if (newReportedPetProm.message) {
          dataContainer.innerHTML = `<x-caption>${newReportedPetProm.message}</x-caption>`;
        }

        // SI LA PROMESA DEVUELVE UN ERROR SE AVISA AL USER
        if (newReportedPetProm.error) {
          dataContainer.innerHTML = `
          <x-caption>${newReportedPetProm.message}</x-caption>
          `;
        }

        // RESETEA LOS VALORES
        dropzone.innerHTML = "Agregar foto";
        mainForm.reset();
      }
    });

    // LISTENER DEL BOTON CANCELAR, REINICIA DROPZONE Y EL FORM
    cancelButton.addEventListener("click", async (e: any) => {
      dropzone.innerHTML = "Agregar foto";
      mainForm.reset();
    });
  }

  // SE CREA EL CONNECTED CALLBACK
  connectedCallback() {
    // RENDERIZA LA PAGE
    this.render();
  }

  render() {
    //SE CREA EL DIV DONDE SE ALOJARA LA PAGE
    const mainPage = document.createElement("main");
    mainPage.classList.add("welcome-container");
    mainPage.innerHTML = `
    <link
      href="//api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.css"
      rel="stylesheet"
    />

    <form class="form-conteiner">
    <x-title class="form-container__title">Reportar mascota perdida</x-title>

    <label class="form-conteiner__label">
    <x-caption class="xcaption">Nombre</x-caption>
    <input class="form-conteiner__input" type=text" name="name">
    </label> 

    <button class="foto-input" type="button">Agregar foto</button>

    <label class="form-conteiner__label">
    <div class="form-conteiner__map"></div>
    <x-caption class="xcaption">Ubicaci??n</x-caption>
    <input class="form-conteiner__input ubication-input" type="search" name="ubication">
    <x-caption class="reference">Busc?? un punto de referencia para reportar a tu mascota. Puede ser una direcci??n, un barrio o una ciudad.</x-caption>
    </label> 

    <button class="form-conteiner__button search-button button3" type="button"><x-p-bold>Buscar</x-p-bold></button>
    <button class="form-conteiner__button" type="submit"><x-p-bold>Reportar como perdido</x-p-bold></button>
    <button class="form-conteiner__button cancel-button button2" type="button"><x-p-bold>Cancelar</x-p-bold></button>
    </form>

    <div class="data-container"></div>
 `;

    this.shadow.appendChild(mainPage);

    // INICIA EL MAPA EN EL CONTENEDOR Y GUADA LA REFERENCIA
    this.map = this.initMap();

    this.addPhotoListener();

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("report-pet-page", ReportPet);
