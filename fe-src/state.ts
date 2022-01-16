const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

const state = {
  data: {},
  listeners: [],

  ///////// BASIC STATE METHODS //////////

  //GETTER
  getState() {
    return this.data;
  },

  //SETTER
  setState(newState) {
    this.data = newState;
    console.log("El nuevo estado es:", newState);
    for (const callback of this.listeners) {
      callback();
    }
    sessionStorage.setItem("actualgame", JSON.stringify(newState));
  },

  //SUBSCRIBER
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  // CREA UN NUEVO USUARIO Y DEVUELVE SU ID
  test() {
    return fetch(API_BASE_URL + "/test", {
      method: "get",
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },
};

export { state };
