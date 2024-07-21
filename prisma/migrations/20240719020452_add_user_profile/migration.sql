-- CreateTable
CREATE TABLE `recommend` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `food_id` INTEGER NOT NULL,
    `recommend` INTEGER NOT NULL DEFAULT 0,

    INDEX `recommend_user_id_idx`(`user_id`),
    INDEX `recommend_food_id_idx`(`food_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recommend` ADD CONSTRAINT `recommend_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recommend` ADD CONSTRAINT `recommend_food_id_fkey` FOREIGN KEY (`food_id`) REFERENCES `userFoodList`(`food_id`) ON DELETE CASCADE ON UPDATE CASCADE;
