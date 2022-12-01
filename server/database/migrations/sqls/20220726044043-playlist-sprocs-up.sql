DROP PROCEDURE IF EXISTS `CreatePlaylist`;

CREATE PROCEDURE CreatePlaylist (
  IN p_id CHAR(21),
  IN p_title VARCHAR(150),
  IN p_description VARCHAR(5000),
  IN p_thumbnailUrl VARCHAR(500),
  IN p_creatorId CHAR(21),
  IN p_creatorChannelName VARCHAR(50),
  IN p_creatorIconUrl VARCHAR(2048),
  IN p_createdAt BIGINT
) BEGIN
INSERT INTO
  playlists (
    playlistId,
    title,
    description,
    numberOfVideos,
    thumbnailUrl,
    creatorId,
    creatorChannelName,
    creatorIconUrl,
    createdAt,
    updatedAt
  )
VALUES
  (
    p_id,
    p_title,
    p_description,
    0,
    p_thumbnailUrl,
    p_creatorId,
    p_creatorChannelName,
    p_creatorIconUrl,
    p_createdAt,
    p_createdAt
  );

END;

DROP PROCEDURE IF EXISTS `UpdatePlaylist`;

CREATE PROCEDURE UpdatePlaylist (
  IN p_id CHAR(21),
  IN p_title VARCHAR(150),
  IN p_description VARCHAR(5000),
  IN p_playlistUrl VARCHAR(500),
  IN p_updatedAt BIGINT
) BEGIN
UPDATE
  playlists
SET
  title = COALESCE(p_title, title),
  description = COALESCE(p_description, description),
  thumbnailUrl = COALESCE(p_playlistUrl, thumbnailUrl),
  updatedAt = p_updatedAt
WHERE
  playlistId = p_id;

SELECT
  *
FROM
  playlists
WHERE
  playlistId = p_id;

END;

DROP PROCEDURE IF EXISTS `DecrementPlaylistVideosCount`;

CREATE PROCEDURE DecrementPlaylistVideosCount (IN p_playlistId CHAR(21)) BEGIN
UPDATE
  playlists
SET
  numberOfVideos = numberOfVideos - 1
WHERE
  playlistId = p_playlistId;

END;

DROP PROCEDURE IF EXISTS `GetCountOfVideosInPlaylist`;

CREATE PROCEDURE GetCountOfVideosInPlaylist (IN p_id CHAR(21)) BEGIN
SELECT
  numberOfVideos
FROM
  playlists
WHERE
  playlistId = p_id;

END;

DROP PROCEDURE IF EXISTS `GetMaxIndexOfVideosInPlaylist`;

CREATE PROCEDURE GetMaxIndexOfVideosInPlaylist (IN p_id CHAR(21)) BEGIN
SELECT
  MAX(videoIndex)
FROM
  videosInPlaylist
WHERE
  playlistId = p_id;

END;

DROP PROCEDURE IF EXISTS `AddVideoToPlaylist`;

CREATE PROCEDURE AddVideoToPlaylist (
  IN p_id CHAR(43),
  IN p_playlistId CHAR(21),
  IN p_videoId CHAR(21),
  IN p_videoTitle VARCHAR(100),
  IN p_videoChannelName VARCHAR(50),
  IN p_videoCreatedAt BIGINT,
  IN p_videoDuration INT,
  IN p_videoThumbnailUrl VARCHAR(2048),
  IN p_videoTotalViews INT,
  IN p_addedAt BIGINT
) BEGIN
INSERT INTO
  videosInPlaylist (
    id,
    playlistId,
    videoId,
    videoTitle,
    videoChannelName,
    videoCreatedAt,
    videoDuration,
    videoThumbnailUrl,
    videoTotalViews,
    addedAt,
    videoIndex
  )
VALUES
  (
    p_id,
    p_playlistId,
    p_videoId,
    p_videoTitle,
    p_videoChannelName,
    p_videoCreatedAt,
    p_videoDuration,
    p_videoThumbnailUrl,
    p_videoTotalViews,
    p_addedAt,
    (
      SELECT
        IF(MAX(videoIndex) IS NULL, 0, MAX(videoIndex) + 1)
      FROM
        videosInPlaylist AS i
      WHERE
        playlistId = p_playlistId
    )
  );

UPDATE
  playlists
SET
  numberOfVideos = numberOfVideos + 1
WHERE
  playlistId = p_playlistId;

END;

DROP PROCEDURE IF EXISTS `RemoveVideoFromPlaylist`;

CREATE PROCEDURE RemoveVideoFromPlaylist (
  IN p_id CHAR(43),
  IN p_playlistId CHAR(21),
  IN p_videoIndex INT
) BEGIN
SELECT
  1
FROM
  videosInPlaylist
WHERE
  id = p_id;

UPDATE
  videosInPlaylist
SET
  videoIndex = videoIndex - 1
WHERE
  playlistId = p_playlistId
  AND videoIndex > p_videoIndex;

DELETE FROM
  videosInPlaylist
WHERE
  id = p_id;

END;

DROP PROCEDURE IF EXISTS `CheckIfVideoIndexIsValid`;

CREATE PROCEDURE CheckIfVideoIndexIsValid (IN p_id CHAR(43), IN p_videoIndex INT) BEGIN
SELECT
  1
FROM
  videosInPlaylist
WHERE
  id = p_id
  AND videoIndex = p_videoIndex;

END;

DROP PROCEDURE IF EXISTS `GetVideosFromPlaylist`;

CREATE PROCEDURE GetVideosFromPlaylist (IN p_playlistId CHAR(21)) BEGIN
SELECT
  *
FROM
  videosInPlaylist
WHERE
  playlistId = p_playlistId;

END;

DROP PROCEDURE IF EXISTS `GetVideosFromPlaylistByAddedAtDesc`;

CREATE PROCEDURE GetVideosFromPlaylistByAddedAtDesc (
  IN p_playlistId CHAR(21),
  IN p_offset INT,
  IN p_limit INT
) BEGIN
SELECT
  *
FROM
  videosInPlaylist
WHERE
  playlistId = p_playlistId
ORDER BY
  addedAt DESC
LIMIT
  p_offset, p_limit;

END;

DROP PROCEDURE IF EXISTS `GetVideosFromPlaylistByAddedAtAsc`;

CREATE PROCEDURE GetVideosFromPlaylistByAddedAtAsc (
  IN p_playlistId CHAR(21),
  IN p_offset INT,
  IN p_limit INT
) BEGIN
SELECT
  *
FROM
  videosInPlaylist
WHERE
  playlistId = p_playlistId
ORDER BY
  addedAt
LIMIT
  p_offset, p_limit;

END;

DROP PROCEDURE IF EXISTS `GetVideosFromPlaylistByCreatedAtDesc`;

CREATE PROCEDURE GetVideosFromPlaylistByCreatedAtDesc (
  IN p_playlistId CHAR(21),
  IN p_offset INT,
  IN p_limit INT
) BEGIN
SELECT
  *
FROM
  videosInPlaylist
WHERE
  playlistId = p_playlistId
ORDER BY
  videoCreatedAt DESC
LIMIT
  p_offset, p_limit;

END;

DROP PROCEDURE IF EXISTS `GetVideosFromPlaylistByCreatedAtAsc`;

CREATE PROCEDURE GetVideosFromPlaylistByCreatedAtAsc (
  IN p_playlistId CHAR(21),
  IN p_offset INT,
  IN p_limit INT
) BEGIN
SELECT
  *
FROM
  videosInPlaylist
WHERE
  playlistId = p_playlistId
ORDER BY
  videoCreatedAt
LIMIT
  p_offset, p_limit;

END;

DROP PROCEDURE IF EXISTS `GetVideosFromPlaylistByPopularity`;

CREATE PROCEDURE GetVideosFromPlaylistByPopularity (
  IN p_playlistId CHAR(21),
  IN p_offset INT,
  IN p_limit INT
) BEGIN
SELECT
  *
FROM
  videosInPlaylist
WHERE
  playlistId = p_playlistId
ORDER BY
  videoTotalViews DESC
LIMIT
  p_offset, p_limit;

END;

DROP PROCEDURE IF EXISTS `GetVideosFromPlaylistByIndex`;

CREATE PROCEDURE GetVideosFromPlaylistByIndex (
  IN p_playlistId CHAR(21),
  IN p_offset INT,
  IN p_limit INT
) BEGIN
SELECT
  *
FROM
  videosInPlaylist
WHERE
  playlistId = p_playlistId
ORDER BY
  videoIndex
LIMIT
  p_offset, p_limit;

END;

DROP PROCEDURE IF EXISTS `GetPlaylistsOfUser`;

CREATE PROCEDURE GetPlaylistsOfUser (IN p_userId CHAR(21)) BEGIN
SELECT
  *
FROM
  playlists
WHERE
  creatorId = p_userId;

END;

DROP PROCEDURE IF EXISTS `DeletePlaylist`;

CREATE PROCEDURE DeletePlaylist (IN p_id CHAR(21)) BEGIN
DELETE FROM
  playlists
WHERE
  playlistId = p_id;

END;

DROP PROCEDURE IF EXISTS `UpdateVideoIndex`;

CREATE PROCEDURE UpdateVideoIndex (
  IN p_id CHAR(43),
  IN p_oldIndex INT,
  IN p_newIndex INT
) BEGIN
UPDATE
  videosInPlaylist
SET
  videoIndex = p_newIndex
WHERE
  id = p_id
  AND videoIndex = p_oldIndex;

END;

DROP PROCEDURE IF EXISTS `IncrementVideoIndices`;

CREATE PROCEDURE IncrementVideoIndices (IN p_startIndex INT, IN p_endIndex INT) BEGIN
UPDATE
  videosInPlaylist
SET
  videoIndex = videoIndex + 1
WHERE
  videoIndex < p_startIndex
  AND videoIndex >= p_endIndex;

END;

DROP PROCEDURE IF EXISTS `DecrementVideoIndices`;

CREATE PROCEDURE DecrementVideoIndices (IN p_startIndex INT, IN p_endIndex INT) BEGIN
UPDATE
  videosInPlaylist
SET
  videoIndex = videoIndex - 1
WHERE
  videoIndex > p_startIndex
  AND videoIndex <= p_endIndex;

END;

DROP PROCEDURE IF EXISTS `GetPlaylistsOfVideo`;

CREATE PROCEDURE GetPlaylistsOfVideo (IN p_videoId CHAR(21)) BEGIN
SELECT
  playlistId,
  videoIndex
FROM
  videosInPlaylist
WHERE
  videoId = p_videoId;

END;

DROP PROCEDURE IF EXISTS `GetOnePlaylist`;

CREATE PROCEDURE GetOnePlaylist (IN p_playlistId CHAR(21)) BEGIN
SELECT
  *
FROM
  playlists
WHERE
  playlistId = p_playlistId;

END;

DROP PROCEDURE IF EXISTS `UpdateVideoInPlaylists`;

CREATE PROCEDURE UpdateVideoInPlaylists (
  IN p_videoId CHAR(21),
  IN p_title VARCHAR(150),
  IN p_videoChannelName VARCHAR(50),
  IN p_thumbnailUrl VARCHAR(2048)
) BEGIN
UPDATE
  videosInPlaylist
SET
  videoTitle = COALESCE(p_title, videoTitle),
  videoChannelName = COALESCE(p_videoChannelName, videoChannelName),
  videoThumbnailUrl = COALESCE(p_thumbnailUrl, videoThumbnailUrl)
WHERE
  videoId = p_videoId;

END;

DROP PROCEDURE IF EXISTS `IncrementPlaylistVideoTotalViews`;

CREATE PROCEDURE IncrementPlaylistVideoTotalViews (IN p_videoId CHAR(21)) BEGIN
UPDATE
  videosInPlaylist
SET
  videoTotalViews = videoTotalViews + 1
WHERE
  videoId = p_videoId;

END;

DROP PROCEDURE IF EXISTS `DecrementNumberOfVideosInPlaylist`;

CREATE PROCEDURE DecrementNumberOfVideosInPlaylist (p_videoId CHAR(21)) BEGIN
UPDATE
  playlists
SET
  numberOfVideos = numberOfVideos - 1
WHERE
  playlistId IN (
    SELECT
      playlistId
    FROM
      videosInPlaylist
    WHERE
      videoId = p_videoId
  );

END;

DROP PROCEDURE IF EXISTS `UpdatePlaylistCreatorData`;

CREATE PROCEDURE UpdatePlaylistCreatorData (
  IN p_creatorId CHAR(21),
  IN p_creatorChannelName VARCHAR(50),
  IN p_creatorIconUrl VARCHAR(2048)
) BEGIN
UPDATE
  playlists
SET
  creatorChannelName = COALESCE(p_creatorChannelName, creatorChannelName),
  creatorIconUrl = COALESCE(p_creatorIconUrl, creatorIconUrl)
WHERE
  creatorId = p_creatorId;

END;

DROP PROCEDURE IF EXISTS `UpdateVideoInPlaylistChannelName`;

CREATE PROCEDURE UpdateVideoInPlaylistChannelName (
  IN p_videoChannelName VARCHAR(50),
  IN p_oldVideoChannelName VARCHAR(50)
) BEGIN
UPDATE
  videosInPlaylist
SET
  videoChannelName = COALESCE(p_videoChannelName, videoChannelName)
WHERE
  videoChannelName = p_oldVideoChannelName;

END;