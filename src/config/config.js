import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'graphql-server',
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    timezone: "+09:00",
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'graphql-server',
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    timezone: "+09:00",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'graphql-server',
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    timezone: "+09:00",
  },
};
