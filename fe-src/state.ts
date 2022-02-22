const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

// BASE DATA
const state = {
  data: {
    userData: {
      geoLocation: null,
      email: null,
      token: null,
      name: null,
      nanoid: null,
      pageToGo: null,
      petToEdit: null,
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

  // SETEA EL ID DE LA MASCOTA PARA EDITAR
  setPetToEdit(petId) {
    const currentState = this.getState();
    currentState.userData.petToEdit = petId;
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

  // ///////// TEST METHODS //////////

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

  // ----- AUTH METHODS -----
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

  ///////// USER METHODS //////////

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

  // EDITA UN USUARIO EN LA BASE DE DATOS
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

  ///////// PETS METHODS //////////
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

  // REPORTA A UNA NUEVA MASCOTA EN LA BASE DE DATOS
  reportNewPet(petData) {
    const cs = state.getState();
    const token = cs.userData.token;
    return fetch(API_BASE_URL + `/pet`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(petData),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // CAMBIA EL ESTADO DE LA MASCOTA
  changePetState(petState, petId) {
    const cs = state.getState();
    const token = cs.userData.token;
    return fetch(API_BASE_URL + `/pet/state/${petId}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(petState),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // EDITA LA INFORMACIÓN SOBRE UNA MASCOTA REPORTADA
  updatePetData(petData, petId) {
    const cs = state.getState();
    const token = cs.userData.token;
    return fetch(API_BASE_URL + `/pet/${petId}`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify(petData),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // DESPUBLICA A UNA MASCOTA DE LA BASE DE DATOS
  depublishPet(petId) {
    const cs = state.getState();
    const token = cs.userData.token;
    return fetch(API_BASE_URL + `/pet/delete/${petId}`, {
      method: "delete",
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

  ///////// REPORT METHODS //////////

  // ENVIA LOS DATOS PARA DAR UN NUEVO INFORME SOBRE UNA MASCOTA PERDIDA
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

  ///////// USER RESTORE METHODS //////////

  // ENVIA LOS DATOS PARA RECUPERAR LA NUEVA CONTRASEÑA AL NO PODER INICIAR
  recoverPassWordEmail(emailData) {
    return fetch(API_BASE_URL + "/auth/recover", {
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

  ///////// RESTORE STATE METHODS //////////

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
