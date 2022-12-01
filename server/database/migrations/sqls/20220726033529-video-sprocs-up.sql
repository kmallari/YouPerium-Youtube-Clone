CREATE PROCEDURE `ReadVideo` (IN p_videoId CHAR(21)) BEGIN IF NOT EXISTS(
    SELECT
        *
    FROM
        `videos`
    WHERE
        `videoId` = p_videoId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Video not found';

ELSE
SELECT
    *
FROM
    `videos`
WHERE
    `videoId` = p_videoId;

END IF;

END;

-- TODO: Add p_asc
CREATE PROCEDURE `ReadChannelVideos` (
    IN p_userId VARCHAR(21),
    IN p_sortBy VARCHAR(30),
    IN p_asc BOOLEAN,
    IN p_offset INT,
    IN p_limit INT
) BEGIN IF p_sortBy = 'videoCreatedAt' THEN IF p_asc = 0 THEN
SELECT
    *
FROM
    `videos`
WHERE
    `userId` = p_userId
ORDER BY
    `videoCreatedAt` DESC
LIMIT
    p_offset, p_limit;

ELSE
SELECT
    *
FROM
    `videos`
WHERE
    `userId` = p_userId
ORDER BY
    `videoCreatedAt` ASC
LIMIT
    p_offset, p_limit;

END IF;

ELSEIF p_sortBy = 'videoTotalViews' THEN IF p_asc = 0 THEN
SELECT
    *
FROM
    `videos`
WHERE
    `userId` = p_userId
ORDER BY
    `videoTotalViews` DESC
LIMIT
    p_offset, p_limit;

ELSE
SELECT
    *
FROM
    `videos`
WHERE
    `userId` = p_userId
ORDER BY
    `videoTotalViews` ASC
LIMIT
    p_offset, p_limit;

END IF;

ELSE SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Invalid sortBy';

END IF;

END;

CREATE PROCEDURE `ReadHomeVideos` (
    IN p_videoCategory VARCHAR(50),
    IN p_offset INT,
    IN p_limit INT
) BEGIN IF p_videoCategory = 'all' THEN
SELECT
    *
FROM
    `videos`
ORDER BY
    `videoTotalViews` DESC
LIMIT
    p_offset, p_limit;

ELSE
SELECT
    *
FROM
    `videos`
WHERE
    `videoCategory` = p_videoCategory
ORDER BY
    `videoTotalViews` DESC
LIMIT
    p_offset, p_limit;

END IF;

END;

DROP PROCEDURE IF EXISTS `ReadPersonalizedHomeVideos`;

CREATE PROCEDURE `ReadPersonalizedHomeVideos` (IN p_videosIds VARCHAR(1000)) BEGIN
SELECT
    *
FROM
    `videos`
WHERE
    FIND_IN_SET (videoId, p_videosIds);

END;

CREATE PROCEDURE `ReadExploreVideos` (IN p_offset INT, IN p_limit INT) BEGIN
SELECT
    *
FROM
    `videos`
ORDER BY
    `videoTotalViews` DESC
LIMIT
    p_offset, p_limit;

END;

CREATE PROCEDURE `ReadSubscriptionsVideos` (
    IN p_userId CHAR(21),
    IN p_timeRange VARCHAR(30),
    IN p_offset INT,
    IN p_limit INT
) BEGIN IF p_timeRange = 'today' THEN
SELECT
    `videos`.*
FROM
    `videos`
    LEFT JOIN `subscriptions` ON `videos`.`userId` = `subscriptions`.`subscribeeId`
WHERE
    `subscriptions`.`subscriberId` = p_userId
    AND (
        YEAR(FROM_UNIXTIME(`videoCreatedAt`)) = YEAR(CURDATE())
        AND MONTH(FROM_UNIXTIME(`videoCreatedAt`)) = MONTH(CURDATE())
        AND DAY(FROM_UNIXTIME(`videoCreatedAt`)) = DAY(CURDATE())
    )
ORDER BY
    `videoTotalViews` DESC
LIMIT
    p_offset, p_limit;

ELSEIF p_timeRange = 'thisWeek' THEN
SELECT
    `videos`.*
FROM
    `videos`
    LEFT JOIN `subscriptions` ON `videos`.`userId` = `subscriptions`.`subscribeeId`
WHERE
    `subscriptions`.`subscriberId` = p_userId
    AND (
        YEAR(FROM_UNIXTIME(`videoCreatedAt`)) = YEAR(CURDATE())
        AND WEEK(FROM_UNIXTIME(`videoCreatedAt`), 1) = WEEK(CURDATE(), 1)
    )
ORDER BY
    `videoTotalViews` DESC
LIMIT
    p_offset, p_limit;

ELSEIF p_timeRange = 'thisMonth' THEN
SELECT
    `videos`.*
FROM
    `videos`
    LEFT JOIN `subscriptions` ON `videos`.`userId` = `subscriptions`.`subscribeeId`
WHERE
    `subscriptions`.`subscriberId` = p_userId
    AND (
        YEAR(FROM_UNIXTIME(`videoCreatedAt`)) = YEAR(CURDATE())
        AND MONTH(FROM_UNIXTIME(`videoCreatedAt`)) = MONTH(CURDATE())
    )
ORDER BY
    `videoTotalViews` DESC
LIMIT
    p_offset, p_limit;

ELSEIF p_timeRange = 'older' THEN
SELECT
    `videos`.*
FROM
    `videos`
    LEFT JOIN `subscriptions` ON `videos`.`userId` = `subscriptions`.`subscribeeId`
WHERE
    `subscriptions`.`subscriberId` = p_userId
ORDER BY
    `videoTotalViews` DESC
LIMIT
    p_offset, p_limit;

ELSE SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Invalid timeRange';

END IF;

END;

CREATE PROCEDURE `ReadNextRecommendedVideo` (
    IN p_videoId CHAR(21),
    IN p_videoCategory VARCHAR(50)
) BEGIN IF NOT EXISTS(
    SELECT
        *
    FROM
        `videos`
    WHERE
        `videoId` != p_videoId
        AND `videoCategory` = p_videoCategory
    ORDER BY
        `videoTotalViews` DESC
    LIMIT
        1
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Video not found';

ELSE
SELECT
    *
FROM
    `videos`
WHERE
    `videoId` != p_videoId
    AND `videoCategory` = p_videoCategory
ORDER BY
    `videoTotalViews` DESC
LIMIT
    1;

END IF;

END;

CREATE PROCEDURE `ReadRecommendedVideos` (
    IN p_videoId CHAR(21),
    IN p_videoCategory VARCHAR(50),
    IN p_offset INT,
    IN p_limit INT
) BEGIN
SELECT
    *
FROM
    `videos`
WHERE
    `videoId` != p_videoId
    AND `videoCategory` = p_videoCategory
ORDER BY
    `videoTotalViews` DESC
LIMIT
    p_offset, p_limit;

END;

CREATE PROCEDURE `SearchVideos` (
    IN p_searchQuery VARCHAR(100),
    IN p_sortBy VARCHAR(25),
    IN p_asc BOOLEAN,
    IN p_offset INT,
    IN p_limit INT
) BEGIN IF p_sortBy = 'videoCreatedAt' THEN
SELECT
    *
FROM
    `videos`
WHERE
    (
        `videoTitle` LIKE CONCAT('%', p_searchQuery, '%')
    )
    OR (
        `videoDescription` LIKE CONCAT('%', p_searchQuery, '%')
    )
    OR (
        `videoCategory` LIKE CONCAT('%', p_searchQuery, '%')
    )
    OR (
        `channelName` LIKE CONCAT('%', p_searchQuery, '%')
    )
ORDER BY
    (2 * p_asc - 1) * `videoCreatedAt` ASC
LIMIT
    p_offset, p_limit;

ELSEIF p_sortBy = 'videoTotalViews' THEN
SELECT
    *
FROM
    `videos`
WHERE
    (
        `videoTitle` LIKE CONCAT('%', p_searchQuery, '%')
    )
    OR (
        `videoDescription` LIKE CONCAT('%', p_searchQuery, '%')
    )
    OR (
        `videoCategory` LIKE CONCAT('%', p_searchQuery, '%')
    )
    OR (
        `channelName` LIKE CONCAT('%', p_searchQuery, '%')
    )
ORDER BY
    (2 * p_asc - 1) * `videoTotalViews` ASC
LIMIT
    p_offset, p_limit;

ELSEIF p_sortBy = 'relevance' THEN
SELECT
    *
FROM
    `videos`
WHERE
    (
        `videoTitle` LIKE CONCAT('%', p_searchQuery, '%')
    )
    OR (
        `videoDescription` LIKE CONCAT('%', p_searchQuery, '%')
    )
    OR (
        `videoCategory` LIKE CONCAT('%', p_searchQuery, '%')
    )
    OR (
        `channelName` LIKE CONCAT('%', p_searchQuery, '%')
    )
ORDER BY
    RAND()
LIMIT
    p_limit;

ELSE SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Invalid sortBy';

END IF;

END;

CREATE PROCEDURE `IncrementVideoTotalViews` (IN p_videoId CHAR(21)) BEGIN DECLARE EXIT HANDLER FOR SQLEXCEPTION,
SQLWARNING BEGIN ROLLBACK;

RESIGNAL;

END;

IF NOT EXISTS(
    SELECT
        `videoTotalViews`
    FROM
        `videos`
    WHERE
        `videoId` = p_videoId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Video not found';

ELSE START TRANSACTION;

UPDATE
    `videos`
SET
    `videoTotalViews` = `videoTotalViews` + 1
WHERE
    `videoId` = p_videoId;

UPDATE
    `users`
SET
    `totalViews` = `totalViews` + 1
WHERE
    `userId` IN (
        SELECT
            `userId`
        FROM
            `videos`
        WHERE
            `videoId` = p_videoId
    );

COMMIT;

SELECT
    `videoTotalViews`
FROM
    `videos`
WHERE
    `videoId` = p_videoId;

END IF;

END;

CREATE PROCEDURE `UpdateVideo` (
    IN p_videoId CHAR(21),
    IN p_videoTitle VARCHAR(100),
    IN p_videoDescription VARCHAR(5000),
    IN p_videoCategory VARCHAR(50)
) BEGIN DECLARE EXIT HANDLER FOR SQLEXCEPTION,
SQLWARNING BEGIN ROLLBACK;

RESIGNAL;

END;

IF NOT EXISTS (
    SELECT
        `videoTitle`,
        `videoDescription`,
        `videoCategory`
    FROM
        `videos`
    WHERE
        `videoId` = p_VideoId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Video not found';

ELSE START TRANSACTION;

UPDATE
    `videos`
SET
    `videoTitle` = p_videoTitle,
    `videoDescription` = p_videoDescription,
    `videoCategory` = p_videoCategory
WHERE
    `videoId` = p_videoId;

COMMIT;

SELECT
    `videoTitle`,
    `videoDescription`,
    `videoCategory`
FROM
    `videos`
WHERE
    `videoId` = p_videoId;

END IF;

END;

CREATE PROCEDURE `UpdateVideoCreatorData` (
    IN p_userId CHAR(21),
    IN p_channelName VARCHAR(60),
    IN p_userProfilePicture VARCHAR(21)
) BEGIN DECLARE EXIT HANDLER FOR SQLEXCEPTION,
SQLWARNING BEGIN ROLLBACK;

RESIGNAL;

END;

IF NOT EXISTS (
    SELECT
        1
    FROM
        `users`
    WHERE
        `userId` = p_userId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'User not found';

ELSE START TRANSACTION;

UPDATE
    `videos`
SET
    `channelName` = COALESCE(p_channelName, `channelName`),
    `userProfilePicture` = COALESCE(p_userProfilePicture, `userProfilePicture`)
WHERE
    `userId` = p_userId;

COMMIT;

SELECT
    `videoId`,
    `channelName`,
    `userProfilePicture`
FROM
    `videos`
WHERE
    `userId` = p_userId;

END IF;

END;

CREATE PROCEDURE `DeleteVideo` (IN p_videoId CHAR(21)) BEGIN DECLARE EXIT HANDLER FOR SQLEXCEPTION,
SQLWARNING BEGIN ROLLBACK;

RESIGNAL;

END;

IF NOT EXISTS(
    SELECT
        *
    FROM
        `videos`
    WHERE
        `videoId` = p_VideoId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Video not found';

ELSE START TRANSACTION;

DELETE FROM
    `videos`
WHERE
    `videoId` = p_videoId;

COMMIT;

END IF;

END;

CREATE PROCEDURE `CreateVideo` (
    IN p_videoId CHAR(21),
    IN p_videoFilePath VARCHAR(255),
    IN p_videoThumbnailPath VARCHAR(255),
    IN p_videoTitle VARCHAR(100),
    IN p_videoDescription VARCHAR(5000),
    IN p_videoCategory VARCHAR(50),
    IN p_videoCreatedAt BIGINT,
    IN p_videoTotalViews INT,
    IN p_videoDuration INT,
    IN p_userId CHAR(21),
    IN p_channelName VARCHAR(20),
    IN p_subscribersCount INT,
    IN p_userProfilePicture VARCHAR(21)
) BEGIN
INSERT INTO
    `videos`
VALUES
    (
        p_videoId,
        p_videoFilePath,
        p_videoThumbnailPath,
        p_videoTitle,
        p_videoDescription,
        p_videoCategory,
        p_videoCreatedAt,
        p_videoTotalViews,
        p_videoDuration,
        p_userId,
        p_channelName,
        p_subscribersCount,
        p_userProfilePicture
    );

END;

CREATE PROCEDURE `UpdateVideoThumbnail` (
    IN p_videoId CHAR(21),
    IN p_videoThumbnailPath VARCHAR(255)
) BEGIN
UPDATE
    `videos`
SET
    videoThumbnailPath = p_videoThumbnailPath
WHERE
    videoId = p_videoId;

END;

CREATE PROCEDURE `IncrementVideoCreatorSubscribersCount` (IN p_userId CHAR(21)) BEGIN
UPDATE
    `videos`
SET
    subscribersCount = subscribersCount + 1
WHERE
    userId = p_userId;

END;

CREATE PROCEDURE `DecrementVideoCreatorSubscribersCount` (IN p_userId CHAR(21)) BEGIN
UPDATE
    `videos`
SET
    subscribersCount = subscribersCount - 1
WHERE
    userId = p_userId;

END;