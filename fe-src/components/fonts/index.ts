const errorIcon = require("../../assets/error.png");

class Title extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .title{
      margin: 0;
      box-sizing: border-box;
      font-family: "Montserrat";
      font-weight: bold;
      font-size: 40px;
    }
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    var text = document.createElement("h2");
    text.classList.add("title");
    text.textContent = this.textContent;
    shadow.appendChild(text);
  }
}
customElements.define("x-title", Title);

class Subtitle extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .subtitle{
      margin: 0;
      box-sizing: border-box;
      font-family: "Poppins", sans-serif;
      font-weight: bold;
      font-size: 24px;
    }
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    var text = document.createElement("h3");
    text.classList.add("subtitle");
    text.textContent = this.textContent;
    shadow.appendChild(text);
  }
}
customElements.define("x-subtitle", Subtitle);

class Parrafo extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .p{
      margin: 0;
      box-sizing: border-box;
      font-family: "Poppins", sans-serif;
      font-weight: normal;
      font-size: 16px;
    }
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    var text = document.createElement("p");
    text.classList.add("p");
    text.textContent = this.textContent;
    shadow.appendChild(text);
  }
}
customElements.define("x-parrafo", Parrafo);

class ParrafoBold extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .p{
      margin: 0;
      box-sizing: border-box;
      font-family: "Poppins", sans-serif;
      font-weight: bold;
      font-size: 16px;
    }
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    var text = document.createElement("p");
    text.classList.add("p");
    text.textContent = this.textContent;
    shadow.appendChild(text);
  }
}
customElements.define("x-p-bold", ParrafoBold);

class LinkText extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .p{
      margin: 0;
      box-sizing: border-box;
      font-family: "Poppins", sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      text-transform: uppercase;
      color: var(--font-link-color);
    }

    .p:hover{
      text-decoration-line: underline;
      }

    .p:active{
      color: var(--button-active)
    }
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    var text = document.createElement("p");
    text.classList.add("p");
    text.textContent = this.textContent;
    shadow.appendChild(text);
  }
}
customElements.define("x-linktext", LinkText);

class Caption extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .p{
      margin: 0;
      box-sizing: border-box;
      font-family: "Poppins", sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      text-transform: uppercase;
    }
    
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    var text = document.createElement("p");
    text.classList.add("p");
    text.textContent = this.textContent;
    shadow.appendChild(text);
  }
}
customElements.define("x-caption", Caption);

class ErrorText extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .label{
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      gap: 7px;
      color: #fb2424;
      border-radius: 5px;
      background-color: #000000b0;
      padding: 3px 7px;
    }

    
    @media (max-width: 500px) {
      .label{
        padding: 3px 6%
      }
    }
    
    .error-icon{
      width: 24px;
      height: 24px;
    }

    .p{
      margin: 0;
      box-sizing: border-box;
      font-family: "Poppins", sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      text-transform: uppercase;
    }

  
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);

    const label = document.createElement("label");
    label.classList.add("label");

    label.innerHTML = `
    <img src=${errorIcon} class="error-icon"></img>
    <p class="p">${this.textContent}</p>
    `;
    shadow.appendChild(label);
  }
}
customElements.define("error-text", ErrorText);
