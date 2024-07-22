-- AlterTable
ALTER TABLE `chatmessages` ADD COLUMN `image_id` INTEGER NULL,
    MODIFY `message` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `chatImageMessage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `filename` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `chatImageMessage_id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `chatMessages_image_id_idx` ON `chatMessages`(`image_id`);

-- AddForeignKey
ALTER TABLE `chatMessages` ADD CONSTRAINT `chatMessages_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `chatImageMessage`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
