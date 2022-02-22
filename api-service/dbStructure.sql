-- Create DB and USER
CREATE DATABASE sportzMitra DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER DATABASE sportzMitra CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE USER 'dvAdmin'@'%' IDENTIFIED BY 'dvAdminPass';
GRANT ALL PRIVILEGES ON sportzMitra.* TO 'dvAdmin'@'%' WITH GRANT OPTION;

-- Create tables

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `profilePicture` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `sports` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` int(100) DEFAULT NULL,
  `type` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `role` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `player` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `sport_type` int(11) DEFAULT NULL,
  `rating` int(1) DEFAULT NULL,
  `category` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;