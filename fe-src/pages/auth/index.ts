class Auth extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    // SE INICIALIZAN LOS ESTILOS DE LA PAGE
    var style = document.createElement("style");
    style.textContent = ` 

    .welcome-container{
      height: 100vh;
      padding: 60px 20px;
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
      gap: 22px;
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

      @media (min-width: 500px){
        .form-conteiner__input{
         width: 100%;
         max-width: 335px;
        }
      
     @media (min-width: 500px){
       .form-conteiner__button{
        width: 100%;
       }
     }
    `;
    this.shadow.appendChild(style);
  }

  addListeners() {
    const mainForm: HTMLFormElement =
      this.shadow.querySelector(".form-conteiner");
    mainForm.addEventListener("submit", (e: any) => {
      e.preventDefault();
      const emailData = e.target.email.value;
      console.log(emailData);
      console.log("soy el submit del form");
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
    <x-title class="form-container__title">Ingresar</x-title>
    <label class="form-conteiner__label">
    <x-caption class="xcaption">Email</x-caption>
    <input class="form-conteiner__input" type=text" name="email">
    </label> 
    <button class="form-conteiner__button" type="submit"><x-p-bold>Siguiente</x-p-bold></button>
    </form>

 `;

    this.shadow.appendChild(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("auth-page", Auth);
