const app = require("./app.js");
const dotenv = require(`dotenv`);
const connectDatabase = require("./config/database.js");
const { mysqlConnection } = require("./config/db.js");

//handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("shutting down the server due to uncaught exception");
  process.exit(1);
});

// env config
dotenv.config({ path: "./backend/config/config.env" });

// connecting mongodb database
connectDatabase();

// connecting mysql database
mysqlConnection();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started running on port -: ${process.env.PORT}`);
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`error : ${err.message}`);
  console.log("shutting down the server due to unhandled promise rejection");

  server.close(() => {
    process.exit(1);
  });
});
