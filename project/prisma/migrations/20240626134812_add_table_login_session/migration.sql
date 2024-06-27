-- CreateTable
CREATE TABLE `LoginSession` (
    `sessionId` VARCHAR(191) NOT NULL,
    `jwsToken` VARCHAR(191) NOT NULL,
    `expiredAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`sessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
