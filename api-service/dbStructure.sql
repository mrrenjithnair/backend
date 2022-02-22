-- Create DB and USER
CREATE DATABASE digivalet DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER DATABASE digivalet CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE USER 'dvAdmin'@'%' IDENTIFIED BY 'dvAdminPass';
GRANT ALL PRIVILEGES ON digivalet.* TO 'dvAdmin'@'%' WITH GRANT OPTION;

-- Create tables
CREATE TABLE `owner_tenant_mapping` (
  `mapping_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `entity_id` bigint(20) DEFAULT NULL,
  `tenant_id` bigint(20) DEFAULT NULL,
  `unit_no` varchar(20) DEFAULT NULL,
  `lease_startdt` datetime DEFAULT NULL,
  `lease_enddt` datetime DEFAULT NULL,
  `tot_mnthagreement` bigint(20) DEFAULT NULL,
  `entry_by` varchar(25) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` varchar(25) DEFAULT NULL,
  `entry_dt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_dt` datetime DEFAULT NULL,
  PRIMARY KEY (`mapping_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `address_dts` (
  `entity_id` bigint(20) NOT NULL,
  `address1` varchar(55) DEFAULT NULL,
  `address2` varchar(55) DEFAULT NULL,
  `unit_no` varchar(20) DEFAULT NULL,
  `is_active` int(11) DEFAULT NULL,
  `entry_by` varchar(25) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` varchar(25) DEFAULT NULL,
  `entry_dt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_dt` datetime DEFAULT NULL,
  `deleted_dt` datetime DEFAULT NULL,
  UNIQUE KEY `uni_resident_address` (`entity_id`,`address1`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `category` (
  `categoryId` int(11) NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(1000) DEFAULT NULL,
  `createdBy` varchar(100) NOT NULL DEFAULT 'SYSTEM',
  `updatedBy` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`categoryId`),
  UNIQUE KEY `uni_category_name` (`categoryName`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
-- INSERT INTO `category` (`id`, `categoryName`, `description`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`)
-- VALUES
-- 	  ('Interest', 'Hobbies or interests', 'SYSTEM', NULL, '2020-11-05 14:52:12', NULL);
--     ('healthAndWellness', 'Health & Wellness', 'SYSTEM', NULL, '2020-11-05 14:52:12', NULL),
--     ('identification', 'Identification', 'SYSTEM', NULL, '2020-11-05 14:52:12', NULL),
--     ('residence', 'Residence', 'SYSTEM', NULL, '2020-11-05 14:52:12', NULL),
--     ('relationship', 'Relationship', 'SYSTEM', NULL, '2020-11-05 14:52:12', NULL);

CREATE TABLE `sub_category` (
  `subCategoryId` int(11) NOT NULL AUTO_INCREMENT,
  `subCategoryName` varchar(100) NOT NULL DEFAULT '',
  `categoryId` int(11) NOT NULL,
  `createdBy` varchar(100) NOT NULL DEFAULT 'SYSTEM',
  `updatedBy` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`subCategoryId`),
  UNIQUE KEY `uni_subcat_name` (`subCategoryName`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

INSERT INTO `sub_category` (`subCategoryName`, `categoryId`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`)
VALUES
	('Culture', 1, 'SYSTEM', NULL, '2020-11-05 15:34:54', NULL),
	('Fitness', 1, 'SYSTEM', NULL, '2020-11-05 15:34:54', NULL),
	('Food and Dining', 1, 'SYSTEM', NULL, '2020-11-05 15:34:54', NULL);

CREATE TABLE `ddl_subcat` (
  `ddlId` int(11) NOT NULL AUTO_INCREMENT,
  `ddlValue` varchar(100) NOT NULL,
  `subCategoryId` int(11) NOT NULL,
  `createdBy` varchar(100) NOT NULL DEFAULT 'SYSTEM',
  `updatedBy` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`ddlId`),
  UNIQUE KEY `uni_ddl_value` (`ddlValue`,`subCategoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

CREATE TABLE `builder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `builder` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tower` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `projectId` int(11) DEFAULT NULL,
  `blockId` int(11) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `floor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `unit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `middleName` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `resident` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `staff_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_health` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `user_health` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rolename` varchar(100) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `createdBy` varchar(100) NOT NULL DEFAULT 'SYSTEM',
  `updatedBy` varchar(100) NOT NULL DEFAULT 'SYSTEM',
  `privileges` longtext,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uc_Role_name` (`rolename`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


CREATE TABLE `user_identities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `resident_pet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `resident_vehicle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `interest_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `interest_sub_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `resident_relation` (
  `id` int(11) NOT NULL AUTO_INCREMENT
  `name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `middleName` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

