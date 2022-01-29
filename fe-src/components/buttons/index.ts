class MenuButton extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .button{
    height: 50px;
    width: 275px;
    border-radius: 4px;
    border: 3px solid #2c2c2c;
    background-color: var(--button1-bgc);
    color: var(--font-colorWht);
    cursor: pointer;
    }

    .button:active{
      background-color: var(--button-active)
    }
    
   @media (min-width: 500px){
     .button{
      width: 355px;
     }
   }
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);

    var menuButton = document.createElement("button");
    menuButton.classList.add("button");

    menuButton.innerHTML = `
    <x-p-bold>${this.textContent}</x-p-bold>
    `;

    shadow.appendChild(menuButton);
  }
}
customElements.define("x-button", MenuButton);
