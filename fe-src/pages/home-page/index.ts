class Home extends HTMLElement {
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
    
    .main-container__title{
      margin: 30px auto;
    }

    .main-conteiner{
      width: 100%;
      max-width: 400px;
      display: flex;
      margin: 0 auto;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 22px;
    }
    `;
    this.shadow.appendChild(style);
  }

  addListeners() {
    const mainButton: HTMLButtonElement = this.shadow.querySelector(
      ".welcome-container__button"
    );
    mainButton.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("soy el button de bienvenida");
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

    <section class="main-conteiner">
    <x-title class="main-container__title">Mascotas perdidas cerca tuyo</x-title>
    <x-caption>Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</x-caption>
    <x-button class="welcome-container__button">Dar mi ubicación</x-button> 
    </section>

 `;

    this.shadow.appendChild(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("home-page", Home);
