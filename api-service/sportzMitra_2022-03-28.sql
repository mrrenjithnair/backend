# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.17)
# Database: sportzMitra
# Generation Time: 2022-03-28 14:36:35 +0000
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
  `description` varchar(5000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `club` WRITE;
/*!40000 ALTER TABLE `club` DISABLE KEYS */;

INSERT INTO `club` (`id`, `name`, `location`, `logo`, `banner`, `Address`, `sportType`, `description`, `createdAt`, `deletedAt`, `updatedAt`)
VALUES
	(1,'Prince Cricket Group','Ambernath','https://i.pinimg.com/originals/28/5a/83/285a83d59750c49d59d726c9490828eb.jpg',NULL,'656V+PVX, Housing Board Colony, Ambernath, Maharashtra 421505',1,'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.','2022-03-05 08:46:41',NULL,'2022-03-05 08:46:41'),
	(2,'Badlapur Star Cricket Club','Badlapur','https://images-platform.99static.com//jCTc2t9R2DNaTcE077EKjsDz8ic=/0x0:1181x1181/fit-in/500x500/99designs-contests-attachments/126/126922/attachment_126922335',NULL,'Hendre Pada, Badlapur, Maharashtra 421503',1,NULL,'2022-03-05 08:46:41',NULL,'2022-03-05 08:46:41'),
	(3,'renjith radhakrishnan nair','Ambernath',NULL,NULL,' 656V+PVX, Housing Board Colony, Ambernath, Maharashtra 421505',1,NULL,'2022-03-10 02:28:11',NULL,'2022-03-10 02:28:11'),
	(4,'wrhihjh','Ambernath',NULL,NULL,' 656V+PVX, Housing Board Colony, Ambernath, Maharashtra 421505',1,NULL,'2022-03-10 02:54:58',NULL,'2022-03-10 02:54:58'),
	(5,'jljl','Ambernath',NULL,NULL,' 656V+PVX, Housing Board Colony, Ambernath, Maharashtra 421505',1,NULL,'2022-03-10 02:55:51',NULL,'2022-03-10 02:55:51'),
	(6,'Ambernath sports','Ambarnath',NULL,NULL,'navre park near aayyapa mandir ambarnath',1,NULL,'2022-03-10 03:13:00',NULL,'2022-03-10 03:13:00'),
	(7,'gamer ','ulhasnagar',NULL,NULL,'pranoti apartment mohan nano',1,NULL,'2022-03-17 03:44:53',NULL,'2022-03-17 03:44:53'),
	(8,'gamer ','ulhasnagar',NULL,NULL,'pranoti apartment mohan nano',1,NULL,'2022-03-17 03:44:53',NULL,'2022-03-17 03:44:53');

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
	(2,3,1),
	(4,3,0),
	(5,3,0),
	(6,3,0);

/*!40000 ALTER TABLE `club_player_mapping` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table club_user_mapping
# ------------------------------------------------------------

DROP TABLE IF EXISTS `club_user_mapping`;

CREATE TABLE `club_user_mapping` (
  `clubId` int(11) unsigned NOT NULL,
  `userId` int(11) NOT NULL,
  `approved` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`clubId`,`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `club_user_mapping` WRITE;
/*!40000 ALTER TABLE `club_user_mapping` DISABLE KEYS */;

INSERT INTO `club_user_mapping` (`clubId`, `userId`, `approved`)
VALUES
	(1,1,0),
	(2,10,1),
	(4,14,1),
	(6,12,1),
	(8,13,1);

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


# Dump of table request
# ------------------------------------------------------------

DROP TABLE IF EXISTS `request`;

CREATE TABLE `request` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `clubId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



# Dump of table role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `privileges` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;

INSERT INTO `role` (`id`, `name`, `privileges`)
VALUES
	(1,'superAdmin','\n{\n    \"club\": {\n        \"addClub\": true,\n        \"clubList\": true,\n        \"assignUser\": true,\n	\"requested\":false,\n	\"addTournament\": false\n    },\n    \"user\":{\"addAdmin\":true},\n    \"dashboard\":{\n        \"myClub\":false,\n        \"clubNearBy\":false,\n        \"playerList\":false,\n        \"clubAdminList\":true,\n        \"tournement\":false\n    }\n}\n'),
	(2,'clubAdmin','{\n    \"club\": {\n        \"addClub\": false,\n        \"clubList\": false,\n        \"assignUser\": false,\n	\"requested\":false,\n	\"addTournament\": true\n    },\n    \"user\":{\"addAdmin\":false},\n    \"dashboard\":{\n        \"myClub\":false,\n        \"clubNearBy\":false,\n        \"playerList\":true,\n        \"clubAdminList\":false,\n        \"tournement\":true\n    }\n}'),
	(3,'player','{\n    \"club\": {\n        \"addClub\": false,\n        \"clubList\": false,\n        \"assignUser\": false,\n	\"requested\":true,\n	\"addTournament\": false\n    },\n    \"user\":{\"addAdmin\":false},\n    \"dashboard\":{\n        \"myClub\":true,\n        \"clubNearBy\":true,\n        \"playerList\":false,\n        \"clubAdminList\":false,\n        \"tournement\":true\n    }\n}');

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
  `logo` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ownerId` bigint(20) DEFAULT NULL,
  `clubId` int(11) DEFAULT NULL,
  `tournamentId` int(11) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT NULL,
  `updatedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;

INSERT INTO `team` (`id`, `name`, `logo`, `ownerId`, `clubId`, `tournamentId`, `createdAt`, `updatedAt`)
VALUES
	(1,'team 1',NULL,NULL,2,NULL,'2022-03-21 10:52:44','2022-03-21 10:52:44'),
	(2,'team 3',NULL,NULL,2,NULL,'2022-03-21 10:52:44','2022-03-21 10:52:44'),
	(3,'team 2',NULL,NULL,2,NULL,'2022-03-21 10:52:44','2022-03-21 10:52:44'),
	(4,'team 4',NULL,NULL,2,NULL,'2022-03-21 10:52:44','2022-03-21 10:52:44'),
	(5,'team 5',NULL,NULL,2,NULL,'2022-03-21 10:52:44','2022-03-21 10:52:44'),
	(6,'team 6',NULL,NULL,2,NULL,'2022-03-21 10:52:44','2022-03-21 10:52:44'),
	(7,'team 7',NULL,NULL,2,NULL,'2022-03-21 10:52:44','2022-03-21 10:52:44'),
	(8,'team 8',NULL,NULL,2,NULL,'2022-03-21 10:52:44','2022-03-21 10:52:44'),
	(9,'team 9',NULL,NULL,2,NULL,'2022-03-21 10:52:44','2022-03-21 10:52:44'),
	(10,'team 10',NULL,NULL,2,NULL,'2022-03-21 10:52:44','2022-03-21 10:52:44'),
	(11,'team 2',NULL,NULL,2,NULL,'2022-03-26 08:39:01','2022-03-26 08:39:01'),
	(12,'team 1',NULL,NULL,2,NULL,'2022-03-26 08:39:01','2022-03-26 08:39:01'),
	(13,'team 4',NULL,NULL,2,NULL,'2022-03-26 08:39:01','2022-03-26 08:39:01'),
	(14,'team 5',NULL,NULL,2,NULL,'2022-03-26 08:39:01','2022-03-26 08:39:01'),
	(15,'team 3',NULL,NULL,2,NULL,'2022-03-26 08:39:01','2022-03-26 08:39:01'),
	(16,'team 6',NULL,NULL,2,NULL,'2022-03-26 08:39:01','2022-03-26 08:39:01'),
	(17,'team 10',NULL,NULL,2,NULL,'2022-03-26 08:39:01','2022-03-26 08:39:01'),
	(18,'team 7',NULL,NULL,2,NULL,'2022-03-26 08:39:01','2022-03-26 08:39:01'),
	(19,'team 9',NULL,NULL,2,NULL,'2022-03-26 08:39:01','2022-03-26 08:39:01'),
	(20,'team 8',NULL,NULL,2,NULL,'2022-03-26 08:39:01','2022-03-26 08:39:01');

/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;


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
  `clubId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

LOCK TABLES `tournament` WRITE;
/*!40000 ALTER TABLE `tournament` DISABLE KEYS */;

INSERT INTO `tournament` (`id`, `name`, `logo`, `startDate`, `endDate`, `teamTotal`, `memberTotal`, `clubId`, `createdAt`, `updatedAt`, `deletedAt`)
VALUES
	(1,'Mumbai 2022','',1646092800000,1648684800000,10,100,2,'2022-03-21 10:52:44','2022-03-25 04:33:29',NULL),
	(2,'renjith',NULL,1647907200000,1650585600000,10,100,2,'2022-03-26 08:39:01','2022-03-26 08:39:01',NULL);

/*!40000 ALTER TABLE `tournament` ENABLE KEYS */;
UNLOCK TABLES;


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
	(1,'renjith','nair',1,'renjith.afs@gmail.com','superAdmin',X'7853011E19D6FF0AB4A1AFDE4DF9AD8312946945FD3ED9DE4A8E5191D85C6374','2022-02-24 03:59:03','https://tmpfiles.org/dl/239270/img_20210107_184127_390.jpg',1,'2022-02-24 03:59:03',NULL),
	(2,'re','nair',1645689600000,'renjith.nair95@gmail.com','player2',X'581D2472A265491940F9CAECF62C72AF57FC71AA5C1D307A951827EB84AAB698','2022-02-24 04:50:49',NULL,3,'2022-02-24 04:50:49',NULL),
	(3,'renjith','nair',1645084800000,'renjithafs1@gmail.com','player',X'B8D961EB8A05BBB3C79A532656FDA5FE2F7410050DC90CB539B379990DD20751','2022-02-27 23:57:29',NULL,3,'2022-02-27 23:57:29',NULL),
	(10,'sachin','pandey',1,'sachin@gmail.com','clubAdmin',X'DE8B35E2DC3B1389446EC64C124595855BDD4D7ECE0C14002FDD27A638C0A37D','2022-03-05 09:44:16',NULL,2,'2022-03-05 09:44:16',NULL),
	(12,'Sneha','Bency',817344000000,'snehab@sjipr.edu.in','renjith',X'7F7E183E1ED1FF3CDB569F8E32065E57D6C7236A815315CD7C84C36E4C25FA0D','2022-03-17 06:26:48',NULL,2,'2022-03-17 06:26:48',NULL),
	(13,'sujith','sujith',1636588800000,'sujith@gmail.com','sujith',X'2991E0987086A680300203BF20EFA4058862B0F72ADD3ACCA40CF4252E993669','2022-03-20 09:36:12',NULL,2,'2022-03-20 09:36:12',NULL),
	(14,'rajasree','nair',752976000000,'rajadree@hmail.com','rajasree',X'A9BCAC30401D7A3E5B91A4DD9E9F57BCFB60E22D140C0D7C907CD0E9B2B91042','2022-03-20 10:01:34',NULL,2,'2022-03-20 10:01:34',NULL);

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
