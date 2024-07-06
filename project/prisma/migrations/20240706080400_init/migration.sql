-- CreateTable
CREATE TABLE `ApiAuthorization` (
    `apiAuthorization` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `endpoint` VARCHAR(191) NOT NULL,
    `authRole` INTEGER NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`apiAuthorization`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginSession` (
    `sessionId` VARCHAR(191) NOT NULL,
    `jwsToken` MEDIUMTEXT NOT NULL,
    `expiredAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`sessionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuthInfo` (
    `authId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `authType` ENUM('default', 'google') NOT NULL,
    `authRole` INTEGER NOT NULL,
    `isVerify` BOOLEAN NOT NULL DEFAULT false,
    `isTrial` BOOLEAN NOT NULL DEFAULT false,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AuthInfo_email_key`(`email`),
    PRIMARY KEY (`authId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuthVerifyOneTimePass` (
    `authVerifyOneTimePassId` VARCHAR(191) NOT NULL,
    `authId` VARCHAR(191) NOT NULL,
    `queryToken` VARCHAR(191) NOT NULL,
    `passCode` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`authVerifyOneTimePassId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trial` (
    `trialId` VARCHAR(191) NOT NULL,
    `trialToken` MEDIUMTEXT NOT NULL,
    `authId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`trialId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserInfo` (
    `userId` VARCHAR(191) NOT NULL,
    `authId` VARCHAR(191) NOT NULL,
    `birthDay` DATETIME(3) NOT NULL,
    `sex` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL DEFAULT '',
    `familyName` VARCHAR(191) NOT NULL,
    `givenName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `tel` VARCHAR(191) NOT NULL,
    `profession` VARCHAR(191) NOT NULL DEFAULT '',
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserInfo_authId_key`(`authId`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BusinessOwnerInfo` (
    `bussinessOwnerId` VARCHAR(191) NOT NULL,
    `authId` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`bussinessOwnerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BusinessBranchInfo` (
    `businessBranchId` VARCHAR(191) NOT NULL,
    `bussinessOwnerId` VARCHAR(191) NOT NULL,
    `branchName` VARCHAR(191) NOT NULL,
    `authId` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`businessBranchId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BusinessStaffInfo` (
    `businessStaffId` VARCHAR(191) NOT NULL,
    `businessBranchId` VARCHAR(191) NOT NULL,
    `authId` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`businessStaffId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientInfo` (
    `clientId` VARCHAR(191) NOT NULL,
    `authId` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`clientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientManagement` (
    `clientManagementId` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `bussinessOwnerId` VARCHAR(191) NOT NULL,
    `businessBranchId` VARCHAR(191) NOT NULL,
    `authId` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`clientManagementId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientVisitHistory` (
    `clientVisitHistoryId` VARCHAR(191) NOT NULL,
    `businessStaffId` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `bussinessOwnerId` VARCHAR(191) NOT NULL,
    `businessBranchId` VARCHAR(191) NOT NULL,
    `visitedAt` DATETIME(3) NOT NULL,
    `leftAt` DATETIME(3) NULL,
    `temopraryReservationServiceManagementId` VARCHAR(191) NULL,
    `serviceMasterId` VARCHAR(191) NULL,
    `couponTicketsId` VARCHAR(191) NULL,
    `usePointOfCouponTickets` DOUBLE NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`clientVisitHistoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientkarteHistory` (
    `clientKarteHistoryId` VARCHAR(191) NOT NULL,
    `clientVisitHistoryId` VARCHAR(191) NOT NULL,
    `detail` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`clientKarteHistoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesManagement` (
    `salesManagementId` VARCHAR(191) NOT NULL,
    `salesDetailId` VARCHAR(191) NOT NULL,
    `businessBranchId` VARCHAR(191) NOT NULL,
    `businessStaffId` VARCHAR(191) NOT NULL,
    `paidAt` DATETIME(3) NULL,
    `salesDay` DATETIME(3) NOT NULL,
    `currency` ENUM('en') NOT NULL DEFAULT 'en',
    `settlement` ENUM('cash', 'card') NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`salesManagementId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemSalesDetail` (
    `itemSalesDetail` VARCHAR(191) NOT NULL,
    `salesManagementId` VARCHAR(191) NOT NULL,
    `authId` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `businessBranchId` VARCHAR(191) NOT NULL,
    `excludeTax` BOOLEAN NOT NULL DEFAULT false,
    `costWitoutTax` INTEGER NOT NULL,
    `salesDay` DATETIME(3) NOT NULL,
    `itemMasterID` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`itemSalesDetail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceSalesDetail` (
    `serviceSalesDetail` VARCHAR(191) NOT NULL,
    `salesManagementId` VARCHAR(191) NOT NULL,
    `authId` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `businessBranchId` VARCHAR(191) NOT NULL,
    `excludeTax` BOOLEAN NOT NULL DEFAULT false,
    `costWitoutTax` INTEGER NOT NULL,
    `salesDay` DATETIME(3) NOT NULL,
    `clientVisitHistoryId` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`serviceSalesDetail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TemporaryReservationServiceManagement` (
    `temopraryReservationServiceManagementId` VARCHAR(191) NOT NULL,
    `isExecuted` BOOLEAN NOT NULL DEFAULT false,
    `authId` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `businessBranchId` VARCHAR(191) NOT NULL,
    `visitedAt` DATETIME(3) NOT NULL,
    `leftAt` DATETIME(3) NOT NULL,
    `serviceMasterID` VARCHAR(191) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`temopraryReservationServiceManagementId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemMaster` (
    `itemMasterID` VARCHAR(191) NOT NULL,
    `bussinessOwnerId` VARCHAR(191) NOT NULL,
    `businessBranchId` VARCHAR(191) NULL,
    `authId` VARCHAR(191) NOT NULL,
    `authRoleForUpdate` INTEGER NOT NULL DEFAULT 3,
    `excludeTax` BOOLEAN NOT NULL DEFAULT false,
    `costWitoutTax` INTEGER NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`itemMasterID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceMaster` (
    `serviceMasterID` VARCHAR(191) NOT NULL,
    `bussinessOwnerId` VARCHAR(191) NOT NULL,
    `businessBranchId` VARCHAR(191) NULL,
    `authId` VARCHAR(191) NOT NULL,
    `authRoleForUpdate` INTEGER NOT NULL DEFAULT 3,
    `excludeTax` BOOLEAN NOT NULL DEFAULT false,
    `costWitoutTaxPerHour` INTEGER NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedBy` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`serviceMasterID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserInfo` ADD CONSTRAINT `UserInfo_authId_fkey` FOREIGN KEY (`authId`) REFERENCES `AuthInfo`(`authId`) ON DELETE RESTRICT ON UPDATE CASCADE;
