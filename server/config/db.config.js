const db = require("knex")({
  client: "mysql",
  connection: {
    host: "db_server",
    port: 3306,
    user: "root",
    password: "password",
    database: "ytclone",
  },
});

module.exports = db;
