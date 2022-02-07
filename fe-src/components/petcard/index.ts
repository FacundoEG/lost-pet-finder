const xMark = require("../../assets/x-mark-white.png");

class lostPet extends HTMLElement {
  shadow: ShadowRoot;
  petName: string;
  petId: string;
  petUbication: string;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    // SE EXTRAE LA DATA DE LOS ATRIBUTOS
    this.petName = this.getAttribute("name");
    this.petId = this.getAttribute("petId");
    this.petUbication = this.getAttribute("ubication");

    // STYLES
    var style = document.createElement("style");
    style.textContent = `
    .card-container{
     border: 2px solid #2c2c2c;
     width: 100%;
     background-color: var(--card-bgc);
     max-width: 350px;
     min-width: 275px;
     border-radius: 5px;
     display: flex;
     flex-direction: column;
     margin-bottom: 40px;
    }

    .card-container:hover {
      border: 2px solid white;
      box-shadow: 0px -1px 5px 3px rgb(255 255 255 / 5%);
    }

    .card-title {
     padding: 15px 15px 0px ;
    }

    .card-label {
     display:flex;
     flex-direction: row;
     padding: 0px 15px 0px ;
     gap:5px;
    }

    .card-link {
    text-align: end;
    padding: 10px 10px
    }

    .card-image {
     height: 150px;
     border-radius: 4px 4px 0px 0px;
 }
   `;
    this.shadow.appendChild(style);
  }

  addListeners() {
    const reportLink = this.shadow.querySelector(".card-link");
    // ESCUCHA EL EVENTO CLICK DEL BOTON DE LA UBICACIÓN
    reportLink.addEventListener("click", async (e) => {
      e.preventDefault();

      // SI SE TOCA EL BOTON DE REPORTE, SE CREA EL MODAL CON EL FORMULARIO
      this.appendReportModal();
    });
  }

  // DESACTIVA EL MODAL LUEGO DE TERMINAR O CERRAR EL REPORTE
  closeModal() {
    // SE HACE REFERENCIA AL CONTENEDOR DEL MODAL
    const homePage = document.children[0].children[1].children[1].children[0];
    const modalContainer =
      homePage.shadowRoot.querySelector(".modal-container");

    // SE AGREGAN LOS TOGGLES
    const modalContainerRef = modalContainer.querySelector(".report-modal");
    modalContainerRef.classList.toggle("active-modal");
    modalContainerRef.classList.toggle("desactive-modal");
    setTimeout(() => {
      modalContainerRef.classList.remove("desactive-modal");
    }, 1000);
  }

  // ESTA FUNCION CREA EL MODAL Y LO ACTIVA EN LA PANTALLA CON EL FORMULARIO PARA REPORTAR
  appendReportModal() {
    // SE TRAE LA DATA DEL COMPONENTE
    const petName = this.petName;
    const petId = this.petId;

    // SE HACE REFERENCIA AL CONTENEDOR DEL MODAL
    const homePage = document.children[0].children[1].children[1].children[0];
    const modalContainer =
      homePage.shadowRoot.querySelector(".modal-container");

    // SE RENDERIZA EL MODAL
    modalContainer.innerHTML = `
    <div class="report-modal">
    <div class="modal-content">
    <button class="report-modal__closebutton">
      <img src=${xMark} class="modal-content__img">
     </button>

    <form class="form-conteiner">
    <x-title class="form-container__title">Reportar info de ${petName}</x-title>

    <label class="form-conteiner__label">
    <x-caption class="xcaption">Tu nombre</x-caption>
    <input class="form-conteiner__input" type=text" name="name">
    </label> 

    <label class="form-conteiner__label">
    <x-caption class="xcaption">Tu telefono</x-caption>
    <input class="form-conteiner__input" type="text" name="phone">
    </label> 

    <label class="form-conteiner__label">
    <x-caption class="xcaption">¿Donde lo viste?</x-caption>
    <textarea class="form-conteiner__input textarea" type="text" name="message"></textarea>
    </label> 

    <button class="form-conteiner__button form-botton" type="submit"><x-p-bold>Enviar</x-p-bold></button>
    </form>
    </div>
    </div>
    `;

    // SE AGREGAN LOS TOGGLES
    const modalContainerRef = modalContainer.querySelector(".report-modal");
    modalContainerRef.classList.toggle("active-modal");

    // LISTENER DEL BOTON DE CERRAR MODAL
    const reportCloseButton = modalContainer.querySelector(
      ".report-modal__closebutton"
    );
    reportCloseButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeModal();
    });

    // LISTENER DEL BOTON DEL FORM
    const modalForm: HTMLFormElement =
      modalContainer.querySelector(".form-conteiner");
    modalForm.addEventListener("submit", (e: any) => {
      e.preventDefault();

      // SE EXTRAE LA DATA DEL FORM
      const nameData = e.target.name.value;
      const phoneData = e.target.phone.value;
      const messageData = e.target.message.value;
      console.log({
        formData: {
          petId,
          nameData,
          phoneData,
          messageData,
        },
      });

      // SE REINICIA EL FORM
      modalForm.reset();

      // SE CIERRA EL MODAL
      this.closeModal();
    });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    // SE DECLARA LA DATA PARA RENDERIZAR LAS CARDS
    const petName = this.petName;
    const petUbication = this.petUbication;

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    // SE CREAN LAS CARDS CON LA DATA TRAIDA
    cardContainer.innerHTML = `
    <img src="https://media.istockphoto.com/photos/little-raccoon-on-tree-picture-id514622028?k=20&m=514622028&s=612x612&w=0&h=okHZBkTHdGCmSlHMTLHwDtPe0GUjrUiypnxLJJjZSOs=" class="card-image"></img>
    <x-subtitle class="card-title">${petName}</x-subtitle>
    <label class="card-label">
    <x-p-bold>UBICACIÓN:</x-p-bold>
    <x-caption>${petUbication}</x-caption></label>
    <x-linktext class="card-link">Reportar Información</x-linktext>
    `;

    this.shadow.appendChild(cardContainer);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("lost-pet", lostPet);
