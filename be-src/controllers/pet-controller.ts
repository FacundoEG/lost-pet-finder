import { Pet } from "../models/models";
import { index } from "../lib/algolia";

// SE TIPA LAS CLASES DE ESTADO QUE PUEDE TENER UN PET
type petState = "perdido" | "encontrado" | "despublicado";

async function reportNewPet(
  petData: {
    name: string;
    photoUrl: string;
    state: string;
    ubication: string;
    lat: number;
    lng: number;
  },
  userDataId: number
) {
  const { name, photoUrl, ubication, state, lat, lng } = petData;

  // VERIFICA QUE TODOS LOS DATOS LLEGUEN CORRECTAMENTE
  if (
    !petData.name ||
    !petData.photoUrl ||
    !petData.state ||
    !petData.lat ||
    !petData.lng ||
    !petData.ubication
  ) {
    return { error: "Faltan datos de la mascota" };
  }

  // DA DE ALTA A LA MASCOTA EN LA TABLA PETS RELACIONANDOLA CON EL USER QUE LA PUBLICO
  const newReportedPet = await Pet.create({
    name,
    photoUrl,
    state,
    ubication,
    lat,
    lng,
    UserId: userDataId,
  });

  // DA DE ALTA A LA MASCOTA EN ALGOLIA
  const newPetInAlgolia = await index.saveObject({
    objectID: newReportedPet.get("id"),
    name: newReportedPet.get("name"),
    _geoloc: {
      lat: newReportedPet.get("lat"),
      lng: newReportedPet.get("lng"),
    },
  });

  // DEVUELVE LA DATA DE LA MASCOTA REPORTADA
  return {
    message: "La mascota fue reportada correctamente",
    newReportedPet,
    newPetInAlgolia,
  };
}

async function updatePetData(
  petData: {
    name?: string;
    photoUrl?: string;
    state?: string;
    ubication?: string;
    lat?: number;
    lng?: number;
  },
  petId: number
) {
  // ACTUALIZA LA DATA DE LA MASCOTA EN LA TABLA PETS
  await Pet.update(petData, {
    where: { id: petId },
  });

  // DEVUELVE LA DATA ACTUALIZADA DE LA MASCOTA
  const petUpdatedData = await Pet.findOne({
    where: { id: petId },
  });

  // ACTUALIZA LA DATA DE LA MASCOTA EN ALGOLIA
  const newPetInAlgolia = await index.saveObject({
    objectID: petUpdatedData.get("id"),
    name: petUpdatedData.get("name"),
    _geoloc: {
      lat: petUpdatedData.get("lat"),
      lng: petUpdatedData.get("lng"),
    },
  });

  // DEVUELVE LA DATA DE LA MASCOTA QUE FUE ACTUALIZADA
  return {
    message: "La data de la mascota fue actualizada correctamente",
    petUpdatedData,
    newPetInAlgolia,
  };
}

async function updatePetState(
  petData: {
    state: petState;
  },
  petId: number
) {
  // VERIFICA QUE SE ENVIE EL NUEVO ESTADO
  if (!petData.state) {
    return { error: "Faltan datos de la mascota" };
  }

  // EDITA EL ESTADO DE LA MASCOTA EN LA TABLA PETS
  await Pet.update(petData, {
    where: { id: petId },
  });

  // DEVUELVE LA DATA ACTUALIZADA DE LA MASCOTA
  const petUpdatedData = await Pet.findOne({
    where: { id: petId },
  });

  // SI LA MASCOTA A ACTUALIZAR NO EXISTE O SU ID ES INVALIDO, SE DEVUELVE UN ERROR
  if (!petUpdatedData) {
    return {
      error: "No existe ninguna mascota reportada con este id",
    };
  }

  // DEVUELVE LA DATA DE LA MASCOTA CON SU NUEVO STATE
  return {
    message: "El estado de la mascota fue actualizada correctamente",
    petUpdatedData,
  };
}

async function deletePetData(petId: number) {
  // ELIMINA A LA MASCOTA EN LA TABLA PETS
  await Pet.destroy({
    where: { id: petId },
  });

  // ELIMINA LA DATA DE LA MASCOTA EN ALGOLIA
  await index.deleteObject(petId.toString());

  // DEVUELVE LA CONFIRMACIÓN DE LA MASCOTA ELIMINADA
  return {
    message: "La mascota fue eliminada correctamente",
  };
}

async function getLostPetsByGeo(searchData: { lat: number; lng: number }) {
  const { lat, lng } = searchData;

  // VERIFICA QUE LOS DATOS DE BUSQUEDA LLEGUEN CORRECTAMENTE
  if (!searchData.lat || !searchData.lng) {
    return { error: "Faltan datos de la busqueda" };
  }

  // BUSCA A LAS MASCOTAS CERCANAS EN ALGOLIA
  const searchResponse = await index.search("", {
    aroundLatLng: `${lat}, ${lng}`,
    aroundRadius: 10000,
  });

  // DEVUELVE LOS IDS DE LAS MASCOTAS ENCONTRADAS
  const findedIds = searchResponse.hits.map((maps) => {
    return maps.objectID;
  });

  // FILTRA A LAS MASCOTAS QUE TENGAN EL STATE "PERDIDO" DE LA TABLA PETS
  const findedPets = await Pet.findAll({
    where: {
      id: findedIds,
      state: "perdido",
    },
  });

  // DEVUELVE LA DATA DE LAS MASCOTAS ENCONTRADAS
  return {
    findedPets,
  };
}

export {
  reportNewPet,
  updatePetData,
  updatePetState,
  deletePetData,
  getLostPetsByGeo,
};
