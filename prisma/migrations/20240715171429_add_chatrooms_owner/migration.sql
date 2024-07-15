ALTER TABLE `chatrooms` ADD COLUMN `owner_id` INT NOT NULL;

-- 여기서 기본값을 설정하거나, 유효한 사용자 ID로 업데이트하세요
-- 예를 들어, 모든 채팅방의 소유자를 ID가 1인 사용자로 설정하려면 다음과 같이 합니다:
UPDATE `chatrooms` SET `owner_id` = 1 WHERE `owner_id` IS NULL;

ALTER TABLE `chatrooms`
ADD CONSTRAINT `chatrooms_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
