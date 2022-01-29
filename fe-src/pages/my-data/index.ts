class MyData extends HTMLElement {
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
    const mainForm: HTMLFormElement =
      this.shadow.querySelector(".form-conteiner");
    mainForm.addEventListener("submit", (e: any) => {
      e.preventDefault();

      const emailData = e.target.email.value;
      const passData = e.target.password.value;
      const passRepeatedData = e.target.passwordRepeat.value;

      console.log(emailData);
      console.log(passData);
      console.log(passRepeatedData);
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

    /* 
    <div class="main-form-container"> 
    <x-title>Soy el title</x-title>
    <x-subtitle>Soy el subtitle</x-subtitle>
    <x-parrafo>Soy el parrafo</x-parrafo>
    <x-p-bold>Soy el parrafo bold</x-p-bold>
    <x-caption>Soy el caption</x-caption>
    <x-linktext>Soy el linktext</x-linktext> */
    //SE RENDERIZA

    mainPage.innerHTML = `

    <form class="form-conteiner">
    <x-title class="form-container__title">Mis Datos</x-title>
    <label class="form-conteiner__label email-label">
    <x-caption class="xcaption">Email</x-caption>
    <input class="form-conteiner__input" type=text" name="email">
    </label> 
    <label class="form-conteiner__label">
    <x-caption class="xcaption">Contraseña</x-caption>
    <input class="form-conteiner__input" type="password" name="password">
    </label> 
    <label class="form-conteiner__label">
    <x-caption class="xcaption">Repetir Contraseña</x-caption>
    <input class="form-conteiner__input" type="password" name="passwordRepeat">
    </label> 
    <button class="form-conteiner__button form-botton" type="submit"><x-p-bold>Guardar</x-p-bold></button>
    <error-text>Soy un error de prueba!</error-text>
    </form>

 `;

    this.shadow.appendChild(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("my-data-page", MyData);
