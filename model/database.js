require("dotenv").config();
const mysql = require("mysql");

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

const con = mysql.createConnection({
  host: DB_HOST || "127.0.0.1",
  user: DB_USER || "root",
  password: DB_PASS,
  database: DB_NAME || "cyclingbuddy",
  multipleStatements: true,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  let sql =
    "DROP TABLE IF EXISTS `users`; CREATE TABLE `users` (   `id` int NOT NULL AUTO_INCREMENT,   `username` varchar(45) DEFAULT NULL,   PRIMARY KEY (`id`),   UNIQUE KEY `username_UNIQUE` (`username`) ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;  DROP TABLE IF EXISTS `rides`; CREATE TABLE `rides` (   `id` int NOT NULL AUTO_INCREMENT,   `startdate` datetime DEFAULT NULL,   `startpoint` varchar(255) DEFAULT NULL,   `title` varchar(45) DEFAULT NULL,   `description` varchar(2000) DEFAULT NULL,   `iscompleted` tinyint DEFAULT '0',   `difficulty` varchar(255) DEFAULT NULL,   `terraintype` varchar(255) DEFAULT NULL,   `createdby` int DEFAULT NULL,   `lengthinkm` float DEFAULT NULL,   PRIMARY KEY (`id`),   KEY `_idx` (`createdby`),   CONSTRAINT `fk_rides_users` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;  DROP TABLE IF EXISTS `users_rides`; /*!50503 SET character_set_client = utf8mb4 */; CREATE TABLE `users_rides` (   `id` int NOT NULL AUTO_INCREMENT,   `user_id` int DEFAULT NULL,   `ride_id` int DEFAULT NULL,   PRIMARY KEY (`id`),   KEY `user_id_idx` (`user_id`),   KEY `ride_id_idx` (`ride_id`),   CONSTRAINT `fk_users_rides_rides` FOREIGN KEY (`ride_id`) REFERENCES `rides` (`id`),   CONSTRAINT `fk_users_rides_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; CREATE TRIGGER `after_rides_insert` AFTER INSERT ON `rides` FOR EACH ROW insert into users_rides (user_id, ride_id) values (new.createdBy, new.id); ALTER TABLE rides ADD COLUMN lat decimal(11,8) DEFAULT '0', ADD COLUMN lng decimal(11,8) DEFAULT '0';";

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("DB creation was successful!");

    console.log("Closing...");
  });

  con.end();
});
