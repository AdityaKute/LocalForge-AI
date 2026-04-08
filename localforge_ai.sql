-- LocalForge AI Database Schema
-- Minimal schema for AI chat application

SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS `localforge_ai`;
CREATE DATABASE `localforge_ai` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `localforge_ai`;

SET time_zone = '+00:00';

DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `conversations`;

CREATE TABLE `conversations` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `idx_conversations_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `messages` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `conversation_id` BIGINT NOT NULL,
  `role` VARCHAR(32) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `metadata` JSON NULL,
  `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `idx_messages_conversation_id` (`conversation_id`),
  INDEX `idx_messages_created_at` (`created_at`),
  CONSTRAINT `fk_messages_conversation` FOREIGN KEY (`conversation_id`)
    REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
