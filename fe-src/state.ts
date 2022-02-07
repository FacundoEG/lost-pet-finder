const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

const state = {
  data: {
    userData: {
      geoLocation: null,
    },
  },
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

  setCurrentGeoLocation(lat, lng) {
    const currentState = this.getState();
    currentState.userData.geoLocation = {
      lat,
      lng,
    };
    this.setState(currentState);
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

  getLostPetsByGeo() {
    const { lat, lng } = this.getState().userData.geoLocation;
    return fetch(API_BASE_URL + `/pets/getbygeo?lat=${lat}&lng=${lng}`, {
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
