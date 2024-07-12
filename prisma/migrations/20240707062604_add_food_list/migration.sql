-- CreateTable
CREATE TABLE `foodList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `menu` VARCHAR(191) NOT NULL,
    `calorie` INTEGER NOT NULL,
    `carb` INTEGER NOT NULL,
    `pro` INTEGER NOT NULL,
    `fat` INTEGER NOT NULL,
    `img` VARCHAR(191) NOT NULL,
    `rcp_seq` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `foodList_rcp_seq_key`(`rcp_seq`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
