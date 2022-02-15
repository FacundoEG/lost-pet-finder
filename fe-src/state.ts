const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

/* 
    <div class="main-form-container"> 
    <x-title>Soy el title</x-title>
    <x-subtitle>Soy el subtitle</x-subtitle>
    <x-parrafo>Soy el parrafo</x-parrafo>
    <x-p-bold>Soy el parrafo bold</x-p-bold>
    <x-caption>Soy el caption</x-caption>
    <x-linktext>Soy el linktext</x-linktext> */

const state = {
  data: {
    userData: {
      geoLocation: null,
      email: null,
      token: null,
      name: null,
      nanoid: null,
      myReportedPets: null,
      pageToGo: null,
    },
  },
  listeners: [],

  ///////// BASIC STATE METHODS //////////

  //GETTER
  getState() {
    return this.data;
  },

  getEmail() {
    const cs = state.getState();
    const emailValue = cs.userData.email;
    return emailValue;
  },

  getToken() {
    const cs = state.getState();
    const tokenValue = cs.userData.token;
    return tokenValue;
  },

  //SETTER
  setState(newState) {
    this.data = newState;
    console.log("El nuevo estado es:", newState);
    for (const callback of this.listeners) {
      callback();
    }
    localStorage.setItem("userData", JSON.stringify(newState));
  },

  // SETEA EL NANO ID
  setNano(nanoId) {
    const currentState = this.getState();
    currentState.userData.nanoid = nanoId;
    this.setState(currentState);
  },

  // SETEA LA PAGINA A LA CUAL QUIERE IR EL USUARIO
  setPageToGo(route) {
    const currentState = this.getState();
    currentState.userData.pageToGo = route;
    this.setState(currentState);
  },

  // SETEA EL EMAIL INGRESADO POR EL USUARIO
  setEmail(emailValue) {
    const currentState = this.getState();
    currentState.userData.email = emailValue;
    this.setState(currentState);
  },

  // SETEA EL NUEVO TOKEN AL AUTENTICAR
  setToken(tokenValue) {
    const currentState = this.getState();
    currentState.userData.token = tokenValue;
    this.setState(currentState);
  },

  // SETEA EL NOMBRE DEL USUARIO AL AUTENTICAR
  setUserName(userName) {
    const currentState = this.getState();
    currentState.userData.name = userName;
    this.setState(currentState);
  },

  // SETEA LA NUEVA LISTA DE MASCOTAS
  setMyPets(petsArray) {
    const currentState = this.getState();
    currentState.userData.myReportedPets = petsArray;
    this.setState(currentState);
  },

  // SEATEA LA LOCALIZACIÓN DEL USUARIO LUEGO DE PREGUNTARLE
  setCurrentGeoLocation(lat, lng) {
    const currentState = this.getState();
    currentState.userData.geoLocation = {
      lat,
      lng,
    };
    this.setState(currentState);
  },

  // LIMPIA EL STATE Y ELIMINA EL LOCALSTORAGE CERRANDO SESSIÓN
  disconnectUser() {
    localStorage.removeItem("userData");
    state.setState({
      userData: {
        geoLocation: null,
        email: null,
        token: null,
        name: null,
        nanoid: null,
        myReportedPets: null,
        pageToGo: null,
      },
    });
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

  // CHEQUEA SI EL USUARIO ESTA REGISTRADO O NO
  emailCheck(emailData) {
    return fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(emailData),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // CHEQUEA QUE EL USUARIO TENGA BIEN SU EMAIL Y CONTRASEÑA Y DEVUELVE UN TOKEN
  authToken(authData) {
    return fetch(API_BASE_URL + "/auth/token", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(authData),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // CREA AL NUEVO USUARIO EN LA BASE DE DATOS
  createNewUser(newUserData) {
    return fetch(API_BASE_URL + "/user", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newUserData),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // CREA AL NUEVO USUARIO EN LA BASE DE DATOS
  updateUserData(updateData) {
    const cs = state.getState();
    const token = cs.userData.token;
    return fetch(API_BASE_URL + `/user/data`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // TRAE LA DATA DEL USUARIO LUEGO DE AUTENTICAR
  getUserData() {
    const cs = state.getState();
    const token = cs.userData.token;
    return fetch(API_BASE_URL + `/user/data`, {
      method: "get",
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // TRAE LAS MASCOTAS PERDIDAS DEL USUARIO
  getReportedPetsByUser() {
    const cs = state.getState();
    const token = cs.userData.token;
    return fetch(API_BASE_URL + `/user/pets`, {
      method: "get",
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // TRAE LAS MASCOTAS PERDIDAS BUSCANDO POR LA UBICACIÓN
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

  // ENVIA LOS DATOS PARA REPORTAR NUEVA INFORMACIÓN DE LA MASCOTA
  sendPetReportInfo(reportData) {
    return fetch(API_BASE_URL + "/pets/report", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(reportData),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  //SI NO HAY REGISTRO DE "USERDATA", SE ASEGURA DE INICIAR EL STATE VACIO
  restoreState() {
    const firstState = state.getState();
    if (!localStorage.userData) {
      state.setState(firstState);
    } else {
      // SI HAY REGISTRO DE "USERDATA" CARGA EL ESTADO CON ESA INFORMACIÓN
      const lastState = localStorage.getItem("userData");
      const lastStateParsed = JSON.parse(lastState);
      state.setState(lastStateParsed);
    }
  },
};

export { state };
