/*
  Warnings:

  - A unique constraint covering the columns `[chatroom_id,user_id]` on the table `chatroom_members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `chatroom_members_chatroom_id_user_id_key` ON `chatroom_members`(`chatroom_id`, `user_id`);
