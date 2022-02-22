import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  username: "obsccrotjermzz",
  password: process.env.SEQ_PASS,
  database: "d3uq3m4fp1lh4d",
  port: 5432,
  host: "ec2-54-224-64-114.compute-1.amazonaws.com",
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

    return "Unable to connect to the database";
  }
}

export { connectionTest };
