-- CreateTable
CREATE TABLE `todayFood` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `food_id` VARCHAR(191) NOT NULL,
    `added_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `todayFood_user_id_idx`(`user_id`),
    INDEX `todayFood_food_id_idx`(`food_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `todayFood` ADD CONSTRAINT `todayFood_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `todayFood` ADD CONSTRAINT `todayFood_food_id_fkey` FOREIGN KEY (`food_id`) REFERENCES `userFoodList`(`food_id`) ON DELETE CASCADE ON UPDATE CASCADE;
