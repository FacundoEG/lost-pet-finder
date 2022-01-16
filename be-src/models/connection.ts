import { Sequelize } from "sequelize";

/* //ESTO HAY QUE COMENTARLO AL HACER DEPLOY
import { sequalizePass } from "../../keys/sequalize";
 */

export const sequelize = new Sequelize({
  dialect: "postgres",
  username: "tldpdccjfekxzm",
  password: process.env.SEQ_PASS,
  database: "dc1i03b0d25dvf",
  port: 5432,
  host: "ec2-18-234-17-166.compute-1.amazonaws.com",
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize.authenticate();

// TESTEA LA CONEXION A SEQUALIZE
async function connectionTest() {
  try {
    await sequelize.authenticate();
    return "Connection has been established successfully.";
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export { connectionTest };
