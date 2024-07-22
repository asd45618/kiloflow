/*
  Warnings:

  - The primary key for the `userfoodlist` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `recommend` DROP FOREIGN KEY `recommend_food_id_fkey`;

-- AlterTable
ALTER TABLE `recommend` MODIFY `food_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `userfoodlist` DROP PRIMARY KEY,
    MODIFY `food_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`food_id`);

-- AddForeignKey
ALTER TABLE `recommend` ADD CONSTRAINT `recommend_food_id_fkey` FOREIGN KEY (`food_id`) REFERENCES `userFoodList`(`food_id`) ON DELETE CASCADE ON UPDATE CASCADE;
