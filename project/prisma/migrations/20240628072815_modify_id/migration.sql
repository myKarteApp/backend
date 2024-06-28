-- DropIndex
DROP INDEX `BusinessBranchInfo_authId_key` ON `BusinessBranchInfo`;

-- DropIndex
DROP INDEX `BusinessOwnerInfo_authId_key` ON `BusinessOwnerInfo`;

-- DropIndex
DROP INDEX `UserInfo_authId_key` ON `UserInfo`;

-- AlterTable
ALTER TABLE `BusinessBranchInfo` MODIFY `authId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `BusinessOwnerInfo` MODIFY `authId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `BusinessStaffInfo` MODIFY `authId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ClientInfo` MODIFY `authId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `UserInfo` MODIFY `authId` VARCHAR(191) NOT NULL;
