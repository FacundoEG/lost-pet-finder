import { Sequelize } from "sequelize";
import { sequalizePass } from "../../keys/sequalize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  username: "tldpdccjfekxzm",
  password: process.env.SEQ_PASS || sequalizePass,
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

async function connectionTest() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export { connectionTest };
