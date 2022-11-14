const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: "root",
  password: "manager",
  port: process.env.MYSQL_PORT,
  database: "urbandb",
});

const mysqlConnection = () => {
  connection.connect(function (err) {
    if (err) throw err;
    console.log(`Mysql connected with server -: ${process.env.MYSQL_HOST}`);
    connection.query(
      `Create database if not exists ${process.env.MYSQL_DATABASE}`,
      function (err, result) {
        if (err) throw err;
        console.log(
          `Database created / database connected -: ${process.env.MYSQL_DATABASE}`
        );
      }
    );
  });
};
module.exports = { mysqlConnection, connection };
