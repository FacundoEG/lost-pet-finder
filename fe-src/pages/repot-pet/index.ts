const pawback = require("../../assets/paw-backgr.png");
class ReportPet extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    // SE INICIALIZAN LOS ESTILOS DE LA PAGE
    var style = document.createElement("style");
    style.textContent = `  

    .welcome-container{
      background-blend-mode: soft-light;
      background-image: url(${pawback});
      background-repeat: revert;
      background-size: contain;
      min-height: 82vh;
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
       width: 100%;
      }
    `;
    this.shadow.appendChild(style);
  }

  addListeners() {
    const mainForm: HTMLFormElement =
      this.shadow.querySelector(".form-conteiner");
    mainForm.addEventListener("submit", (e: any) => {
      e.preventDefault();
      const nameData = e.target.name.value;
      const ubicationData = e.target.ubication.value;
      console.log(nameData);
      console.log(ubicationData);
      console.log("soy el submit del form");

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

    <form class="form-conteiner">
    <x-title class="form-container__title">Reportar mascota perdida</x-title>

    <label class="form-conteiner__label">
    <x-caption class="xcaption">Nombre</x-caption>
    <input class="form-conteiner__input" type=text" name="name">
    </label> 

    <button class="form-conteiner__button button3" type="button"><x-p-bold>agregar / modificar foto</x-p-bold></button>

    <label class="form-conteiner__label">
    <x-caption class="xcaption">Ubicación</x-caption>
    <input class="form-conteiner__input" type=text" name="ubication">
    <x-caption class="reference">Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</x-caption>
    </label> 


    <button class="form-conteiner__button" type="submit"><x-p-bold>Reportar como perdido</x-p-bold></button>
    <button class="form-conteiner__button button2" type="button"><x-p-bold>Cancelar</x-p-bold></button>
    <error-text>Soy un error de prueba!</error-text>
    </form>

 `;

    this.shadow.appendChild(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("report-pet-page", ReportPet);
