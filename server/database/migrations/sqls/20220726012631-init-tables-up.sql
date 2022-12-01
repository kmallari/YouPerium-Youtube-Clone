CREATE DATABASE IF NOT EXISTS `ytclone`;

USE `ytclone`;

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `userId` VARCHAR(21) NOT NULL UNIQUE PRIMARY KEY,
  `userProfilePicture` VARCHAR(21) NOT NULL,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `userPassword` VARCHAR(60) NOT NULL,
  `email` VARCHAR(320) NOT NULL UNIQUE,
  `firstName` VARCHAR(64) NOT NULL,
  `lastName` VARCHAR(64) NOT NULL,
  `age` TINYINT NOT NULL,
  -- channel portion of user entity.
  `channelName` VARCHAR(60) UNIQUE,
  `channelDescription` VARCHAR(5000),
  `channelBanner` VARCHAR(21),
  `subscribersCount` INT NOT NULL,
  `totalViews` INT NOT NULL DEFAULT 0,
  `createdAt` BIGINT NOT NULL,
  INDEX (`channelName`),
  INDEX (`subscribersCount`),
  INDEX (`createdAt`),
  INDEX (`username`)
);

DROP TABLE IF EXISTS `videos`;

CREATE TABLE `videos` (
  -- Unique to video entity.
  `videoId` CHAR(21) NOT NULL UNIQUE,
  `videoFilePath` VARCHAR(255) NOT NULL,
  `videoThumbnailPath` VARCHAR(255),
  `videoTitle` VARCHAR(100) NOT NULL,
  `videoDescription` VARCHAR(5000),
  `videoCategory` VARCHAR(50) NOT NULL,
  `videoCreatedAt` BIGINT NOT NULL,
  `videoTotalViews` INT NOT NULL DEFAULT 0,
  `videoDuration` INT NOT NULL,
  -- From user entity.
  `userId` VARCHAR(21) NOT NULL,
  `channelName` VARCHAR(60),
  `subscribersCount` INT NOT NULL,
  `userProfilePicture` VARCHAR(21),
  PRIMARY KEY (`videoId`),
  FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `commentId` CHAR(21) NOT NULL UNIQUE,
  `parentCommentId` CHAR(21),
  `commentText` VARCHAR(10000) NOT NULL,
  `commentNetLikes` INT NOT NULL DEFAULT 0,
  `commentRepliesCount` INT DEFAULT 0,
  `commentCreatedAt` BIGINT NOT NULL,
  `videoId` CHAR(21) NOT NULL,
  `userId` CHAR(21) NOT NULL,
  `channelName` VARCHAR(60),
  `userProfilePicture` VARCHAR(21) NOT NULL,
  
  PRIMARY KEY (`commentId`),
  FOREIGN KEY (`videoId`) REFERENCES `videos` (`videoId`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `commentsLikes`;

CREATE TABLE `commentsLikes` (
  `commentId` CHAR(21) NOT NULL,
  `userId` CHAR(21) NOT NULL,
  `like` BOOLEAN,

  FOREIGN KEY (`commentId`) REFERENCES `comments` (`commentId`) ON DELETE CASCADE,
  FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `playlists`;

CREATE TABLE playlists (
  `playlistId` CHAR(21) PRIMARY KEY,
  `title` varchar(150) NOT NULL,
  `description` varchar(5000) NOT NULL,
  `numberOfVideos` INT NOT NULL DEFAULT 0,
  `thumbnailUrl` varchar(500) NOT NULL,
  `creatorId` CHAR(21) NOT NULL,
  `creatorChannelName` varchar(50) NOT NULL,
  `creatorIconUrl` varchar(2048) NOT NULL,
  `createdAt` BIGINT NOT NULL,
  `updatedAt` BIGINT NOT NULL,
  FOREIGN KEY (`creatorId`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  INDEX (`creatorId`),
  INDEX (`createdAt`)
);

DROP TABLE IF EXISTS `videosInPlaylist`;

CREATE TABLE videosInPlaylist (
  `id` CHAR(43) PRIMARY KEY,
  `playlistId` CHAR(21) NOT NULL,
  `videoId` CHAR(21) NOT NULL,
  `videoTitle` VARCHAR(100) NOT NULL,
  `videoChannelName` VARCHAR(50) NOT NULL,
  `videoCreatedAt` BIGINT NOT NULL,
  `videoDuration` INT NOT NULL,
  `videoThumbnailUrl` VARCHAR(2048) NOT NULL,
  `videoTotalViews` INT NOT NULL DEFAULT 0,
  `videoIndex` INT NOT NULL,
  `addedAt` BIGINT NOT NULL,
  FOREIGN KEY (playlistId) REFERENCES playlists(playlistId) ON DELETE CASCADE,
  FOREIGN KEY (videoId) REFERENCES videos(videoId) ON DELETE CASCADE,
  INDEX (`playlistId`),
  INDEX (`videoId`),
  INDEX (`videoIndex`),
  INDEX (`videoCreatedAt`),
  INDEX (`addedAt`)
);

DROP TABLE IF EXISTS `subscriptions`;

CREATE TABLE `subscriptions` (
  `subscriptionId` VARCHAR(21) NOT NULL,
  `subscriberId` VARCHAR(21) NOT NULL,
  `subscribeeId` VARCHAR(21) NOT NULL,
  `subscribeeChannelName` VARCHAR(60) NOT NULL,
  `subscribeePicture` VARCHAR(21),
  `createdAt` BIGINT NOT NULL,
  PRIMARY KEY (`subscriptionId`),
  FOREIGN KEY (`subscriberId`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  FOREIGN KEY (`subscribeeId`) REFERENCES `users` (`userId`) ON DELETE CASCADE,
  INDEX (`subscriberId`),
  INDEX (`subscribeeId`)
);