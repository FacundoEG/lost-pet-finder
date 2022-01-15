class Home extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    // SE INICIALIZAN LOS ESTILOS DE LA PAGE
    var style = document.createElement("style");
    style.textContent = ` 

    .main-form-container{
      width: 400px;
      height: 600px;
      border: solid 1px black;
      padding: 20px;
    }

    .main-form__form{
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
    }

    .main-form__span{
      font-size: 24px;
    }

    .main-form__name-input{
      height: 20px
    }
    
    .main-form__bio-input{
      height: 100px
    }

    .main-form__button{
      margin-top: 10px;
      height: 30px;
      width: 150px;
      align-self: center;
      font-size: 16px
    }

 
    .foto-input{      
      min-height: 30px;
      color: white;
      width:100%;
       border: 1px solid black;
       background-color: #106BB2;
       border-radius: 10px
     }

    .main-form__image-container{
      height: 200px;
      border: 1px rgba(0, 0, 0, 0.6) solid
      
    }
    
    .main-form__name-input,.main-form__bio-input,.main-form__image-container{
      margin: 0px 0px 20px 0px;
      padding: 5px
    }

    `;
    this.shadow.appendChild(style);
  }

  addListeners() {}

  // SE CREA EL CONNECTED CALLBACK
  connectedCallback() {
    // RENDERIZA LA PAGE
    this.render();
  }
  render() {
    //SE CREA EL DIV DONDE SE ALOJARA LA PAGE
    const mainPage = document.createElement("main");
    mainPage.classList.add("welcome-container");

    //SE RENDERIZA
    mainPage.innerHTML = `
    <div class="main-form-container"> 
    <h1>TAMO READY PARA ARRANCAR EL DESAFIO MONO?</h1>
    </div>
 `;

    this.shadow.appendChild(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("home-page", Home);
