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
  },

  //SUBSCRIBER
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  // TESTEA LA CONEXIÓN A SEQUALIZE
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

  algoliaTest() {
    return fetch(
      `http://localhost:3000/petsbygeo?lat=-34.758566&long=-58.275575`,
      {
        method: "get",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },
};

export { state };
