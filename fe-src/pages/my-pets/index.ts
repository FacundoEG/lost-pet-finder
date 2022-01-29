class MyPets extends HTMLElement {
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
    mainPage.innerHTML = `
    <section class="main-container">
    <x-title class="main-container__title">Mis mascotas reportadas</x-title>
    <x-caption class="xcaption">AUN NO TIENES MASCOTAS REPORTADAS</x-caption>
    </section>
 `;

    this.shadow.appendChild(mainPage);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("my-pets-page", MyPets);
