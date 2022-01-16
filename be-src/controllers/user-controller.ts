import { User } from "../models";
import { cloudinary } from "../cloudinary";

async function postProfile(userData: {
  name: string;
  bio: number;
  photoURL: string;
}) {
  if (!userData.name || !userData.bio || !userData.photoURL) {
    return { error: "faltan datos del usuario" };
  }

  let userExistente = await User.findOne({ where: { name: userData.name } });

  if (userExistente) {
    return userExistente;
  }

  if (!userExistente) {
    const uploadRes = await cloudinary.v2.uploader.upload(
      userData.photoURL,
      function (error, result) {
        console.log(result, error);
      }
    );

    userData.photoURL = uploadRes.url;

    const newUserData = await User.create({
      name: userData.name,
      bio: userData.bio,
      photoUrl: userData.photoURL,
    });
    return newUserData;
  }
}

async function getProfile(userData: { name: string }) {
  if (!userData.name) {
    return { error: "faltan datos del usuario" };
  }

  let userExistente = await User.findOne({ where: { name: userData.name } });

  if (userExistente) {
    return userExistente;
  }

  if (!userExistente) {
    return { error: "el usuario que buscas no existe en la base de datos" };
  }
}

export { postProfile, getProfile };
