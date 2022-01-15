import { Model, DataTypes } from "sequelize";
import { sequelize } from "./connection";

export class User extends Model {}
User.init(
  {
    name: DataTypes.STRING,
    bio: DataTypes.STRING,
    img: DataTypes.STRING,
  },
  { sequelize, modelName: "User" }
);
