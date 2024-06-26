-- CreateTable
CREATE TABLE `AuthInfo` (
    `authId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `authType` ENUM('default', 'google') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AuthInfo_email_key`(`email`),
    PRIMARY KEY (`authId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccountInfo` (
    `accountId` VARCHAR(191) NOT NULL,
    `authId` INTEGER NOT NULL,
    `familyName` VARCHAR(191) NOT NULL,
    `givenName` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AccountInfo_authId_key`(`authId`),
    PRIMARY KEY (`accountId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
