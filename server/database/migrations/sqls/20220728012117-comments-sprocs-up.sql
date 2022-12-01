CREATE PROCEDURE `CreateComment` (
    IN p_commentId CHAR(21),
    IN p_commentText VARCHAR(10000),
    IN p_commentNetLikes INT,
    IN p_commentRepliesCount INT,
    IN p_commentCreatedAt BIGINT,
    IN p_parentCommentId CHAR(21),
    IN p_videoId CHAR(21),
    IN p_userId CHAR(21),
    IN p_channelName VARCHAR(60),
    IN p_userProfilePicture VARCHAR(21)
) BEGIN DECLARE EXIT HANDLER FOR SQLEXCEPTION,
SQLWARNING BEGIN ROLLBACK;

RESIGNAL;

END;

IF p_parentCommentId IS NOT NULL
AND NOT EXISTS (
    SELECT
        *
    FROM
        `comments`
    WHERE
        `videoId` = p_videoId
        AND `commentId` = p_parentCommentId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Parent comment not found';

ELSEIF NOT EXISTS(
    SELECT
        *
    FROM
        `videos`
    WHERE
        `videoId` = p_videoId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Video not found';

ELSEIF NOT EXISTS(
    SELECT
        *
    FROM
        `users`
    WHERE
        `userId` = p_userId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'User not found';

ELSE START TRANSACTION;

INSERT INTO
    `comments` (
        `commentId`,
        `commentText`,
        `commentNetLikes`,
        `commentRepliesCount`,
        `commentCreatedAt`,
        `parentCommentId`,
        `videoId`,
        `userId`,
        `channelName`,
        `userProfilePicture`
    )
VALUES
    (
        p_commentId,
        p_commentText,
        p_commentNetLikes,
        p_commentRepliesCount,
        p_commentCreatedAt,
        p_parentCommentId,
        p_videoId,
        p_userId,
        p_channelName,
        p_userProfilePicture
    );

IF p_parentCommentId IS NOT NULL THEN
UPDATE
    `comments`
SET
    `commentRepliesCount` = `commentRepliesCount` + 1
WHERE
    `commentId` = p_parentCommentId;

END IF;

COMMIT;

SELECT
    *,
    NULL AS `likedByUser`
FROM
    `comments`
WHERE
    `commentId` = p_commentId;

END IF;

END;

CREATE PROCEDURE `ReadComment` (
    In p_videoId CHAR(21),
    IN p_commentId CHAR(21),
    IN p_userId CHAR(21)
) BEGIN IF NOT EXISTS(
    SELECT
        1
    FROM
        `comments`
    WHERE
        `videoId` = p_videoId
        AND `commentId` = p_commentId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Comment not found';

ELSE
SELECT
    *,
    (
        SELECT
            `like`
        FROM
            `commentsLikes`
        WHERE
            `commentId` = p_commentId
            AND `userId` = p_userId
    ) AS `likedByUser`
FROM
    `comments`
WHERE
    `videoId` = p_videoId
    AND `commentId` = p_commentId;

END IF;

END;

CREATE PROCEDURE `ReadComments` (
    In p_videoId CHAR(21),
    IN p_userId CHAR(21),
    IN p_sortBy VARCHAR(50),
    IN p_offset INT,
    IN p_limit INT
) BEGIN IF NOT EXISTS(
    SELECT
        *
    FROM
        `videos`
    WHERE
        `videoId` = p_videoId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Video not found';

ELSE IF p_sortBy = 'commentCreatedAt' THEN
SELECT
    *,
    (
        SELECT
            `like`
        FROM
            `commentsLikes`
        WHERE
            `commentId` = `comments`.`commentId`
            AND `userId` = p_userId
    ) AS `likedByUser`
FROM
    `comments`
WHERE
    `videoId` = p_videoId
    AND `parentCommentId` IS NULL
ORDER BY
    `commentCreatedAt` DESC
LIMIT
    p_offset, p_limit;

ELSEIF p_sortBy = 'commentNetLikes' THEN
SELECT
    *,
    (
        SELECT
            `like`
        FROM
            `commentsLikes`
        WHERE
            `commentId` = `comments`.`commentId`
            AND `userId` = p_userId
    ) AS `likedByUser`
FROM
    `comments`
WHERE
    `videoId` = p_videoId
    AND `parentCommentId` IS NULL
ORDER BY
    `commentNetLikes` DESC
LIMIT
    p_offset, p_limit;

ELSE SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Invalid sortBy';

END IF;

END IF;

END;

CREATE PROCEDURE `ReadReplies` (
    IN p_videoId CHAR(21),
    IN p_commentId CHAR(21),
    IN p_userId CHAR(21)
) BEGIN IF NOT EXISTS (
    SELECT
        *
    FROM
        `comments`
    WHERE
        `videoId` = p_videoId
        AND `commentId` = p_commentId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Comment not found';

ELSE
SELECT
    *,
    (
        SELECT
            `like`
        FROM
            `commentsLikes`
        WHERE
            `commentId` = `comments`.`commentId`
            AND `userId` = p_userId
    ) AS `likedByUser`
FROM
    `comments`
WHERE
    `videoId` = p_videoId
    AND `parentCommentId` = p_commentId
ORDER BY
    `commentCreatedAt` ASC;

END IF;

END;

CREATE PROCEDURE `ReadDeletedCommentAndItsReplies` (
    IN p_videoId CHAR(21),
    IN p_commentId CHAR(21),
    IN p_userId CHAR(21)
) BEGIN IF NOT EXISTS (
    SELECT
        *
    FROM
        `comments`
    WHERE
        `videoId` = p_videoId
        AND `commentId` = p_commentId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Comment not found';

ELSE
SELECT
    *,
    (
        SELECT
            `like`
        FROM
            `commentsLikes`
        WHERE
            `commentId` = `comments`.`commentId`
            AND `userId` = p_userId
    ) AS `likedByUser`
FROM
    `comments`
WHERE
    `videoId` = p_videoId
    AND (
        `commentId` = p_commentId
        OR `parentCommentId` = p_commentId
    )
ORDER BY
    `commentCreatedAt` ASC;

END IF;

END;

CREATE PROCEDURE `ReadVideoTotalNumberOfComments` (IN p_videoId CHAR(21)) BEGIN IF NOT EXISTS (
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
    COUNT(*) AS `totalNumberOfComments`
FROM
    `comments`
WHERE
    `videoId` = p_videoId;

END IF;

END;

CREATE PROCEDURE `UpdateCommentText` (
    IN p_videoId CHAR(21),
    IN p_commentId CHAR(21),
    IN p_commentText VARCHAR(10000)
) BEGIN DECLARE EXIT HANDLER FOR SQLEXCEPTION,
SQLWARNING BEGIN ROLLBACK;

RESIGNAL;

END;

IF NOT EXISTS (
    SELECT
        *
    FROM
        `comments`
    WHERE
        `videoId` = p_videoId
        AND `commentId` = p_commentId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Comment not found';

ELSE START TRANSACTION;

UPDATE
    `comments`
SET
    `commentText` = p_commentText
WHERE
    `videoId` = p_videoId
    AND `commentId` = p_commentId;

COMMIT;

SELECT
    `commentId`,
    `commentText`
FROM
    `comments`
WHERE
    `videoId` = p_videoId
    AND `commentId` = p_commentId;

END IF;

END;

CREATE PROCEDURE `UpdateCommentNetLikes` (
    IN p_videoId CHAR(21),
    IN p_commentId CHAR(21),
    IN p_userId CHAR(21),
    IN p_increment BOOLEAN
) BEGIN DECLARE EXIT HANDLER FOR SQLEXCEPTION,
SQLWARNING BEGIN ROLLBACK;

RESIGNAL;

END;

SET
    @liked = (
        SELECT
            `like`
        FROM
            `commentsLikes`
        WHERE
            `commentId` = p_commentId
            AND `userId` = p_userId
    );

IF NOT EXISTS (
    SELECT
        1
    FROM
        `comments`
    WHERE
        `videoId` = p_videoId
        AND `commentId` = p_commentId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Comment not found';

ELSEIF NOT EXISTS (
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

IF p_increment THEN -- If the user has already liked the comment, remove the like.
IF @liked = 1 THEN
UPDATE
    `comments`
SET
    `commentNetLikes` = `commentNetLikes` - 1
WHERE
    `videoId` = p_videoId
    AND `commentId` = p_commentId;

DELETE FROM
    `commentsLikes`
WHERE
    `commentId` = p_commentId
    AND `userId` = p_userId;

-- If the user has disliked the comment, 
-- remove the dislike first and then add the like.
ELSEIF @liked = 0 THEN
UPDATE
    `comments`
SET
    `commentNetLikes` = `commentNetLikes` + 2
WHERE
    `videoId` = p_videoId
    AND `commentId` = p_commentId;

UPDATE
    `commentsLikes`
SET
    `like` = 1
WHERE
    `commentId` = p_commentId
    AND `userId` = p_userId;

-- If the user has not yet liked/disliked the comment, add the like.
ELSE
UPDATE
    `comments`
SET
    `commentNetLikes` = `commentNetLikes` + 1
WHERE
    `videoId` = p_videoId
    AND `commentId` = p_commentId;

INSERT INTO
    `commentsLikes` (`commentId`, `userId`, `like`)
VALUES
    (p_commentId, p_userId, 1);

END IF;

ELSE -- If the user has liked the comment, 
-- remove the like first before adding the dislike.
IF @liked = 1 THEN
UPDATE
    `comments`
SET
    `commentNetLikes` = `commentNetLikes` - 2
WHERE
    `videoId` = p_videoId
    AND `commentId` = p_commentId;

UPDATE
    `commentsLikes`
SET
    `like` = 0
WHERE
    `commentId` = p_commentId
    AND `userId` = p_userId;

-- If the user has already disliked the comment, remove the dislike.
ELSEIF @liked = 0 THEN
UPDATE
    `comments`
SET
    `commentNetLikes` = `commentNetLikes` + 1
WHERE
    `videoId` = p_videoId
    AND `commentId` = p_commentId;

DELETE FROM
    `commentsLikes`
WHERE
    `commentId` = p_commentId
    AND `userId` = p_userId;

-- If the user has not yet liked/disliked the comment, add the dislike.
ELSE
UPDATE
    `comments`
SET
    `commentNetLikes` = `commentNetLikes` - 1
WHERE
    `videoId` = p_videoId
    AND `commentId` = p_commentId;

INSERT INTO
    `commentsLikes` (`commentId`, `userId`, `like`)
VALUES
    (p_commentId, p_userId, 0);

END IF;

END IF;

COMMIT;

SELECT
    `commentId`,
    `commentNetLikes`,
    (
        SELECT
            `like`
        FROM
            `commentsLikes`
        WHERE
            `commentId` = p_commentId
            AND `userId` = p_userId
    ) AS `likedByUser`
FROM
    `comments`
WHERE
    `videoId` = p_videoId
    AND `commentId` = p_commentId;

END IF;

END;

CREATE PROCEDURE `DeleteCommentAndItsReplies` (
    IN p_videoId CHAR(21),
    IN p_commentId CHAR(21)
) BEGIN DECLARE EXIT HANDLER FOR SQLEXCEPTION,
SQLWARNING BEGIN ROLLBACK;

RESIGNAL;

END;

IF NOT EXISTS (
    SELECT
        *
    FROM
        `comments`
    WHERE
        `videoId` = p_videoId
        AND `commentId` = p_commentId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Comment not found';

ELSE START TRANSACTION;

DELETE FROM
    `comments`
WHERE
    `videoId` = p_videoId
    AND (
        `commentId` = p_commentId
        OR `parentCommentId` = p_commentId
    );

COMMIT;

END IF;

END;

CREATE PROCEDURE `DeleteReply` (
    IN p_videoId CHAR(21),
    IN p_commentId CHAR(21),
    IN p_parentCommentId CHAR(21)
) BEGIN DECLARE EXIT HANDLER FOR SQLEXCEPTION,
SQLWARNING BEGIN ROLLBACK;

RESIGNAL;

END;

IF NOT EXISTS (
    SELECT
        *
    FROM
        `comments`
    WHERE
        `videoId` = p_videoId
        AND `commentId` = p_commentId
) THEN SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'Comment not found';

ELSE START TRANSACTION;

DELETE FROM
    `comments`
WHERE
    `videoId` = p_videoId
    AND `commentId` = p_commentId;

UPDATE
    `comments`
SET
    `commentRepliesCount` = `commentRepliesCount` - 1
WHERE
    `videoId` = p_videoId
    AND `commentId` = p_parentCommentId;

COMMIT;

END IF;

END;

DROP PROCEDURE IF EXISTS `UpdateCommentCreatorData`;

CREATE PROCEDURE `UpdateCommentCreatorData` (
    IN p_userId CHAR(21),
    IN p_channelName VARCHAR(60),
    IN p_userProfilePicture VARCHAR(21)
) BEGIN 
UPDATE
    `comments`
SET
    `channelName` = COALESCE(p_channelName, channelName),
    `userProfilePicture` = COALESCE(p_userProfilePicture, userProfilePicture)
WHERE
    `userId` = p_userId;

END;