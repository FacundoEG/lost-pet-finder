import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  username: "jzpspoxgzdggrb",
  password: "4c0738a53987450fcc7caeb628d3c6bc4c654fbf111e461cde4196b72862e520",
  database: "dffmm8e2ltoqna",
  port: 5432,
  host: "ec2-100-24-227-178.compute-1.amazonaws.com",
  ssl: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize.authenticate();
