import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connection";

export class Pet extends Model {}
Pet.init(
  {
    name: DataTypes.STRING,
    photoUrl: DataTypes.STRING,
    state: DataTypes.STRING,
    ubication: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
  },
  { sequelize, modelName: "Pet" }
);
