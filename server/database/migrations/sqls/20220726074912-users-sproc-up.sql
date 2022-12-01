DROP PROCEDURE IF EXISTS `CreateUser`;

CREATE PROCEDURE `CreateUser`(
    IN p_userId VARCHAR(21),
    IN p_userProfilePicture VARCHAR(21),
    IN p_username VARCHAR(60),
    IN p_userPassword VARCHAR(60),
    IN p_email VARCHAR(320),
    IN p_firstName VARCHAR(64),
    IN p_lastName VARCHAR(64),
    IN p_age TINYINT,
    IN p_channelName VARCHAR(60),
    IN p_channelDescription VARCHAR(5000),
    IN p_channelBanner VARCHAR(21),
    IN p_subscribersCount INT,
    IN p_totalViews BIGINT,
    IN p_createdAt BIGINT
) BEGIN
INSERT INTO
    users (
        userId,
        userProfilePicture,
        username,
        userPassword,
        email,
        firstName,
        lastName,
        age,
        channelName,
        channelDescription,
        channelBanner,
        subscribersCount,
        totalViews,
        createdAt
    )
VALUES
    (
        p_userId,
        p_userProfilePicture,
        p_username,
        p_userPassword,
        p_email,
        p_firstName,
        p_lastName,
        p_age,
        p_channelName,
        p_channelDescription,
        p_channelBanner,
        p_subscribersCount,
        p_totalViews,
        p_createdAt
    );

END;

DROP PROCEDURE IF EXISTS `LoginUserByEmail`;

CREATE PROCEDURE `LoginUserByEmail`(IN p_email VARCHAR(320)) BEGIN
SELECT
    userId,
    userPassword
FROM
    users
WHERE
    email = p_email;

END;

DROP PROCEDURE IF EXISTS `LoginUserByUsername`;

CREATE PROCEDURE `LoginUserByUsername`(IN p_username VARCHAR(60)) BEGIN
SELECT
    userId,
    userPassword
FROM
    users
WHERE
    username = p_username;

END;

DROP PROCEDURE IF EXISTS `LoginUserByUserId`;

CREATE PROCEDURE `LoginUserByUserId`(IN p_userId VARCHAR(21)) BEGIN
SELECT
    userId,
    userPassword
FROM
    users
WHERE
    userId = p_userId;

END;

DROP PROCEDURE IF EXISTS `GetUserById`;

CREATE PROCEDURE `GetUserById`(IN p_userId VARCHAR(21)) BEGIN
SELECT
    userId,
    userProfilePicture,
    username,
    email,
    firstName,
    lastName,
    age,
    channelName,
    channelDescription,
    channelBanner,
    subscribersCount,
    totalViews,
    createdAt
FROM
    users
WHERE
    userId = p_userId;

END;

DROP PROCEDURE IF EXISTS `GetUserByUsername`;

CREATE PROCEDURE `GetUserByUsername`(IN p_username VARCHAR(60)) BEGIN
SELECT
    userId,
    userProfilePicture,
    username,
    email,
    firstName,
    lastName,
    age,
    channelName,
    channelDescription,
    channelBanner,
    subscribersCount,
    totalViews,
    createdAt
FROM
    users
WHERE
    username = p_username;

END;

DROP PROCEDURE IF EXISTS `GetUserByChannelName`;

CREATE PROCEDURE `GetUserByChannelName`(IN p_channelName VARCHAR(60)) BEGIN
SELECT
    userId,
    userProfilePicture,
    username,
    email,
    firstName,
    lastName,
    age,
    channelName,
    channelDescription,
    channelBanner,
    subscribersCount,
    totalViews,
    createdAt
FROM
    users
WHERE
    channelName = p_channelName;

END;

DROP PROCEDURE IF EXISTS `PatchUserById`;

CREATE PROCEDURE `PatchUserById`(
    IN p_userId VARCHAR(21),
    IN p_userProfilePicture VARCHAR(21),
    IN p_username VARCHAR(60),
    IN p_userPassword VARCHAR(60),
    IN p_email VARCHAR(320),
    IN p_firstName VARCHAR(64),
    IN p_lastName VARCHAR(64),
    IN p_age TINYINT,
    IN p_channelName VARCHAR(60),
    IN p_channelDescription VARCHAR(5000),
    IN p_channelBanner VARCHAR(21),
    IN p_subscribersCount INT
) BEGIN
UPDATE
    users
SET
    username = COALESCE(p_username, username),
    userProfilePicture = COALESCE(p_userProfilePicture, userProfilePicture),
    userPassword = COALESCE(p_userPassword, userPassword),
    email = COALESCE(p_email, email),
    firstName = COALESCE(p_firstName, firstName),
    lastName = COALESCE(p_lastName, lastName),
    age = COALESCE(p_age, age),
    channelName = COALESCE(p_channelName, channelName),
    channelDescription = COALESCE(p_channelDescription, channelDescription),
    channelBanner = COALESCE(p_channelBanner, channelBanner),
    subscribersCount = COALESCE(p_subscribersCount, subscribersCount)
WHERE
    userId = p_userId;

SELECT
    userId,
    userProfilePicture,
    username,
    email,
    firstName,
    lastName,
    age,
    channelName,
    channelDescription,
    channelBanner,
    subscribersCount,
    totalViews,
    createdAt
FROM
    users
WHERE
    userId = p_userId;

END;

DROP PROCEDURE IF EXISTS `PatchChannelDataForSubscriptions`;

CREATE PROCEDURE `PatchChannelDataForSubscriptions`(
    IN p_userId VARCHAR(21),
    IN p_channelName VARCHAR(60),
    IN p_channelPicture VARCHAR(5000)
) BEGIN

    UPDATE
        subscriptions
    SET
        subscribeeChannelName = COALESCE(p_channelName, subscribeeChannelName),
        subscribeePicture = COALESCE(p_channelPicture, subscribeePicture)
    WHERE
        subscribeeId = p_userId;

END;


DROP PROCEDURE IF EXISTS `SearchChannels`;

CREATE PROCEDURE `SearchChannels`
(
    IN p_searchQuery VARCHAR(100),
    IN p_sortBy VARCHAR(25),
    IN p_asc BOOLEAN,
    IN p_offset INT,
    IN p_limit INT
)
BEGIN
    IF p_sortBy = 'createdAt' THEN 
        SELECT *
        FROM `users`
        WHERE 
            (`channelName` LIKE CONCAT('%', p_searchQuery, '%')) OR 
            (`channelDescription` LIKE CONCAT('%', p_searchQuery, '%'))
        ORDER BY (2*p_asc - 1) * `createdAt` ASC
        LIMIT p_offset, p_limit;
    ELSEIF p_sortBy = 'subscribersCount' THEN
        SELECT *
        FROM `users`
        WHERE 
            (`channelName` LIKE CONCAT('%', p_searchQuery, '%')) OR 
            (`channelDescription` LIKE CONCAT('%', p_searchQuery, '%'))
        ORDER BY (2*p_asc - 1) * `subscribersCount` ASC
        LIMIT p_offset, p_limit;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid sortBy';
    END IF;
END;

DROP PROCEDURE IF EXISTS `SubscribeToChannel`;

CREATE PROCEDURE `SubscribeToChannel`(
    IN p_subscriptionId VARCHAR(21),
    IN p_subscriberId VARCHAR(21),
    IN p_subscribeeId VARCHAR(21),
    IN p_subscribeeChannelName VARCHAR(60),
    IN p_subscribeePicture VARCHAR(21),
    IN p_createdAt BIGINT
) BEGIN
INSERT INTO
    subscriptions (
        subscriptionId,
        subscriberId,
        subscribeeId,
        subscribeeChannelName,
        subscribeePicture,
        createdAt
    )
VALUES
    (
        p_subscriptionId,
        p_subscriberId,
        p_subscribeeId,
        p_subscribeeChannelName,
        p_subscribeePicture,
        p_createdAt
    );

UPDATE
    users
SET
    subscribersCount = subscribersCount + 1
WHERE
    userId = p_subscribeeId;

END;

DROP PROCEDURE IF EXISTS `UnsubscribeFromChannel`;

CREATE PROCEDURE `UnsubscribeFromChannel`(
    IN p_subscriptionId VARCHAR(21),
    IN p_subscribeeId VARCHAR(21)
) BEGIN
DELETE FROM
    subscriptions
WHERE
    subscriptionId = p_subscriptionId;

UPDATE
    users
SET
    subscribersCount = subscribersCount - 1
WHERE
    userId = p_subscribeeId;

END;

DROP PROCEDURE IF EXISTS `GetSubscriptionsByUserId`;

CREATE PROCEDURE `GetSubscriptionsByUserId`(IN p_subscriberId VARCHAR(21)) BEGIN
SELECT
    subscriptionId,
    subscriberId,
    subscribeeId,
    subscribeeChannelName,
    subscribeePicture,
    createdAt
FROM
    subscriptions
WHERE
    subscriberId = p_subscriberId
ORDER BY
    createdAt DESC;

END;

DROP PROCEDURE IF EXISTS `GetSubscriptionById`;

CREATE PROCEDURE `GetSubscriptionById`(IN p_subscriptionId VARCHAR(21)) BEGIN
SELECT
    *
FROM
    subscriptions
WHERE
    subscriptionId = p_subscriptionId;

END;