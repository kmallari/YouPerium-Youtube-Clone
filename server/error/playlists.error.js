const CustomError = require("./CustomError");
const GlobalError = require("./global.error");

// ERROR RANGE: 40000 - 50000

class PlaylistsError extends GlobalError {
  static TitleError = () => {
    return new CustomError(
      400,
      "Invalid title. Title must be between 0-50 characters long.",
      40001
    );
  };

  static DescriptionError = () => {
    return new CustomError(
      400,
      "Invalid description. Description must be between 0-5000 characters long.",
      40002
    );
  };

  static PlaylistNotFoundError = () => {
    return new CustomError(404, "Playlist not found", 40003);
  };

  static OrderByError = () => {
    return new CustomError(
      400,
      "Invalid orderBy. Valid values are: addedAtDesc, addedAtAsc, createdAtDesc, createdAtAsc, popularity, and custom",
      40004
    );
  };

  static PageNumberError = () => {
    return new CustomError(
      400,
      "Invalid page number. Page number must be greater than 0.",
      40005
    );
  };

  static PageSizeError = () => {
    return new CustomError(
      400,
      "Invalid page size. Page size must be between 1-100.",
      40006
    );
  };

  static IndexError = () => {
    return new CustomError(
      400,
      "Invalid video index. Index must be between 0 - number of videos in the playlist.",
      40007
    );
  };

  static VideoNotFoundError = () => {
    return new CustomError(404, "Video not found in the playlist.", 40008);
  };

  static VideoHasIncorrectIndexError = () => {
    return new CustomError(
      400,
      "The video-playlist and index combination you entered is invalid.",
      40009
    );
  };

  static idError = () => {
    return new CustomError(
      400,
      "Invalid id. Id must follow the nanoid format.",
      40010
    );
  }
}

module.exports = PlaylistsError;
