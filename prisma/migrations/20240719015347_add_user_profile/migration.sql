/*
  Warnings:

  - You are about to drop the `foodlist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `foodlist`;

-- CreateTable
CREATE TABLE `userFoodList` (
    `food_id` INTEGER NOT NULL AUTO_INCREMENT,
    `menu` VARCHAR(191) NOT NULL,
    `calorie` INTEGER NOT NULL,
    `carb` INTEGER NOT NULL,
    `pro` INTEGER NOT NULL,
    `fat` INTEGER NOT NULL,
    `img` VARCHAR(191) NOT NULL,
    `food_seq` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `userFoodList_food_seq_key`(`food_seq`),
    PRIMARY KEY (`food_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
