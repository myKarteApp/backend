-- AlterTable
ALTER TABLE `AuthInfo` ADD COLUMN `authRole` ENUM('admin', 'super', 'guest') NOT NULL DEFAULT 'guest';
