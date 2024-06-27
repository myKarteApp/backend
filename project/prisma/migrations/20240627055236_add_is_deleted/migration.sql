-- AlterTable
ALTER TABLE `AccountInfo` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `AuthInfo` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `LoginSession` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;
