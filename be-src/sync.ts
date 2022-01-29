import { sequelize } from "./models/connection";
import "./models/models";

sequelize.sync({ force: true }).then((res) => console.log(res));
