# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.17)
# Database: sportzMitra
# Generation Time: 2022-03-09 11:35:45 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table club
# ------------------------------------------------------------

DROP TABLE IF EXISTS `club`;

CREATE TABLE `club` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banner` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Address` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sportType` int(10) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `club` WRITE;
/*!40000 ALTER TABLE `club` DISABLE KEYS */;

INSERT INTO `club` (`id`, `name`, `location`, `logo`, `banner`, `Address`, `sportType`, `createdAt`, `updatedAt`)
VALUES
	(1,'Prince Cricket Group','Ambernath','https://i.pinimg.com/originals/28/5a/83/285a83d59750c49d59d726c9490828eb.jpg',NULL,'656V+PVX, Housing Board Colony, Ambernath, Maharashtra 421505',1,'2022-03-05 08:46:41','2022-03-05 08:46:41'),
	(2,'Badlapur Star Cricket Club','Badlapur','https://images-platform.99static.com//jCTc2t9R2DNaTcE077EKjsDz8ic=/0x0:1181x1181/fit-in/500x500/99designs-contests-attachments/126/126922/attachment_126922335',NULL,'Hendre Pada, Badlapur, Maharashtra 421503',1,'2022-03-05 08:46:41','2022-03-05 08:46:41');

/*!40000 ALTER TABLE `club` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table club_player_mapping
# ------------------------------------------------------------

DROP TABLE IF EXISTS `club_player_mapping`;

CREATE TABLE `club_player_mapping` (
  `clubId` int(11) unsigned NOT NULL,
  `playerId` int(11) DEFAULT NULL,
  `approved` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `club_player_mapping` WRITE;
/*!40000 ALTER TABLE `club_player_mapping` DISABLE KEYS */;

INSERT INTO `club_player_mapping` (`clubId`, `playerId`, `approved`)
VALUES
	(1,10,0),
	(2,3,1);

/*!40000 ALTER TABLE `club_player_mapping` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table club_user_mapping
# ------------------------------------------------------------

DROP TABLE IF EXISTS `club_user_mapping`;

CREATE TABLE `club_user_mapping` (
  `clubId` int(11) unsigned NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `approved` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `club_user_mapping` WRITE;
/*!40000 ALTER TABLE `club_user_mapping` DISABLE KEYS */;

INSERT INTO `club_user_mapping` (`clubId`, `userId`, `approved`)
VALUES
	(1,3,1);

/*!40000 ALTER TABLE `club_user_mapping` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table player
# ------------------------------------------------------------

DROP TABLE IF EXISTS `player`;

CREATE TABLE `player` (
  `userId` int(11) DEFAULT NULL,
  `sportsTypeId` int(11) DEFAULT NULL,
  `rating` int(1) DEFAULT NULL,
  `category` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `player` WRITE;
/*!40000 ALTER TABLE `player` DISABLE KEYS */;

INSERT INTO `player` (`userId`, `sportsTypeId`, `rating`, `category`, `createdAt`, `updatedAt`)
VALUES
	(1,1,1,'all-rounder ','2022-02-24 03:59:03','2022-02-24 03:59:03'),
	(2,1,1,'all-rounder ','2022-02-24 04:50:49','2022-02-24 04:50:49'),
	(3,1,1,'all-rounder ','2022-02-27 23:57:29','2022-02-27 23:57:29');

/*!40000 ALTER TABLE `player` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;

INSERT INTO `role` (`id`, `name`)
VALUES
	(1,'superAdmin'),
	(2,'clubAdmin'),
	(3,'player');

/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table sports
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sports`;

CREATE TABLE `sports` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `sports` WRITE;
/*!40000 ALTER TABLE `sports` DISABLE KEYS */;

INSERT INTO `sports` (`id`, `name`, `type`)
VALUES
	(1,'Cricket','Outdoor');

/*!40000 ALTER TABLE `sports` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table team
# ------------------------------------------------------------

DROP TABLE IF EXISTS `team`;

CREATE TABLE `team` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Logo` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ownerId` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table team_owner_mapping
# ------------------------------------------------------------

DROP TABLE IF EXISTS `team_owner_mapping`;

CREATE TABLE `team_owner_mapping` (
  `team_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `clubId` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `approved` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table team_player_mapping
# ------------------------------------------------------------

DROP TABLE IF EXISTS `team_player_mapping`;

CREATE TABLE `team_player_mapping` (
  `team_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table tournament
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tournament`;

CREATE TABLE `tournament` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startDate` bigint(20) DEFAULT NULL,
  `endDate` bigint(20) DEFAULT NULL,
  `teamTotal` bigint(100) DEFAULT NULL,
  `memberTotal` bigint(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table tournament_team_mapping
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tournament_team_mapping`;

CREATE TABLE `tournament_team_mapping` (
  `tournament_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `team_id` int(11) DEFAULT NULL,
  `approved` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`tournament_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` bigint(20) DEFAULT NULL,
  `emailId` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` blob,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `profilePicture` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`id`, `firstName`, `lastName`, `dob`, `emailId`, `username`, `password`, `createdAt`, `profilePicture`, `roleId`, `updatedAt`, `deletedAt`)
VALUES
	(1,'renjith','nair',1,'renjith.afs@gmail.com','renjithafs',X'7853011E19D6FF0AB4A1AFDE4DF9AD8312946945FD3ED9DE4A8E5191D85C6374','2022-02-24 03:59:03',NULL,1,'2022-02-24 03:59:03',NULL),
	(2,'re','nair',1645689600000,'renjith.nair95@gmail.com','renjithnair95',X'581D2472A265491940F9CAECF62C72AF57FC71AA5C1D307A951827EB84AAB698','2022-02-24 04:50:49',NULL,3,'2022-02-24 04:50:49',NULL),
	(3,'renjith','nair',1645084800000,'renjithafs1@gmail.com','renjith.nair',X'B8D961EB8A05BBB3C79A532656FDA5FE2F7410050DC90CB539B379990DD20751','2022-02-27 23:57:29',NULL,3,'2022-02-27 23:57:29',NULL),
	(10,'sachin','pandey',1,'sachin@gmail.com','sachin',X'DE8B35E2DC3B1389446EC64C124595855BDD4D7ECE0C14002FDD27A638C0A37D','2022-03-05 09:44:16',NULL,2,'2022-03-05 09:44:16',NULL);

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
