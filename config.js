if (process.env.MODE !== "PROD") {
  require('dotenv').config();
}

export default {
  PORT: process.env.PORT,
  DB: {
    SQL_DATABASE: process.env.SQL_DATABASE,
    SQL_USERNAME: process.env.SQL_USERNAME,
    SQL_PASSWORD: process.env.SQL_PASSWORD,
    SQL_HOST: process.env.SQL_HOST,
    SQL_PORT: process.env.SQL_PORT
  }
}