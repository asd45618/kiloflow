/*
  Warnings:

  - Added the required column `calories` to the `todayExercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `todayExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `todayexercise` ADD COLUMN `calories` DOUBLE NOT NULL,
    ADD COLUMN `duration` INTEGER NOT NULL;
