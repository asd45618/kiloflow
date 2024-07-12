/*
  Warnings:

  - Added the required column `max_members` to the `chatrooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chatrooms` ADD COLUMN `max_members` INTEGER NOT NULL;
