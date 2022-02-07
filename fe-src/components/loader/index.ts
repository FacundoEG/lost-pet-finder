class Loader extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .big-circle {
      width: 3rem;
      height: 3rem;
      border: 5px solid #ffff;
      border-radius: 50%;
      display:flex;
      align-items:center;
      justify-content:center;
      position:relative;
      border-color: #fff transparent #fff #fff;
      animation: bigcircle 1.2s linear infinite;
    }
    .small-circle {
      position:relative;
      width: 1.5rem;
      height: 1.5rem;
      border: 5px solid #ffff;
      border-radius: 50%;
      border-color: #fff #fff transparent #fff;
    }
    
    @keyframes bigcircle {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }    
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);

    var loader = document.createElement("div");

    loader.innerHTML = `
    <div class="big-circle">
    <div class="small-circle"></div>
    </div>
    `;

    shadow.appendChild(loader);
  }
}
customElements.define("x-loader", Loader);
