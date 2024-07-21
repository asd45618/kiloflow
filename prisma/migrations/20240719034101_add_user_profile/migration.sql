/*
  Warnings:

  - Added the required column `user_id` to the `userFoodList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userfoodlist` ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `userFoodList_user_id_idx` ON `userFoodList`(`user_id`);

-- AddForeignKey
ALTER TABLE `userFoodList` ADD CONSTRAINT `userFoodList_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
