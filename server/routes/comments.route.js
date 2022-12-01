/*
	Comments API

	Method: POST
	* createComment
		- route:
			- POST /comments/:videoId
		- params:
			- videoId (string)
		- request body fields:
			- commentText (string)
			- userId (string)
			- channelName (string)
			- userProfilePicture (string)
		- returns:
			- new comment
		- example:
			- POST /comments/VVVVVVVVVVVVVVVVVVV82
			  Request Body:
				{
					"commentText": "This is a comment",
					"userId": "UUUUUUUUUUUUUUUUUUUU1",
					"channelName": "Test User 1",
					"userProfilePicture": "PPPPPPPPPPPPPPPPPPPP1"
				}
	
	* createReply
		- route:
			- POST /comments/:videoId/:commentId
		- params:
			- videoId (string)
			- commentId (string, this is the root comment being replied to)
		- request body fields:
			- commentText (string)
			- userId (string)
			- channelName (string)
			- userProfilePicture (string)
		- returns:
			- new reply to a comment
		- example:
			- POST /comments/VVVVVVVVVVVVVVVVVVV82/HW3WsUzA_f7-RVWxw7ahY
			  Request Body:
				{
					"commentText": "This is a reply.",
					"userId": "UUUUUUUUUUUUUUUUUUUU1",
					"channelName": "Test User 1",
					"userProfilePicture": "PPPPPPPPPPPPPPPPPPPP1"
				}
		- note:
			- raises error when replying to another reply comment.

	Method: GET
	* readComment
		- route:
			- GET /comments/:videoId/:commentId?userId=*
		- params:
			- videoId (string)
			- commentId (string)
		- query params:
			- userId (string)
		- returns:
			- comment
		- example: 
			- GET /comments/VVVVVVVVVVVVVVVVVVV82/HW3WsUzA_f7-RVWxw7ahY?userId=UUUUUUUUUUUUUUUUUUUU1
	
	* readComments
		- route:
			- GET /comments/:videoId?userId=*&sortBy=*&offset=*&limit=*
		- params:
			- videoId (string)
		- query params:
			- userId (string)
			- sortBy ('commentNetLikes' | 'commentCreatedAt')
			- offset (int >= 0)
			- limit (int >= 1)
		- returns:
			- root comments in the provided video.
		- example:
			- GET /comments/VVVVVVVVVVVVVVVVVVV82?userId=UUUUUUUUUUUUUUUUUUUU1&sortBy=commentNetLikes&offset=0&limit=10
	
	* readReplies
		- route:
			- GET /comments/:videoId/:commentId/replies?userId=*
		- params:
			- videoId (string)
			- commentId (string)
		- query params:
			- userId (string)
		- returns:
			- replies of a root comment.
		- example:
			- GET /comments/VVVVVVVVVVVVVVVVVVV82/HW3WsUzA_f7-RVWxw7ahY/replies?userId=UUUUUUUUUUUUUUUUUUUU1
		- note:
			- raises error when called on a reply comment (parentCommentId !== null).

	* readVideoTotalNumberOfComments
		- route:
			- GET /comments/:videoId/total
		- params:
			- videoId (string)
		- returns:
			- video's total number of comments (includes both root comments and replies)
		- example:
			- GET /comments/VVVVVVVVVVVVVVVVVVV82/total

	Method: PATCH
	* updateCommentText
		- route:
			- PATCH /comments/:videoId/:commentId/commentText
			  Request Body:
				{
					"commentText":*
				}
		- params:
			- videoId (string)
			- commentId (string)
		- request body fields:
			- commentText (string)
		- returns:
			- updated commentText
		- example:
			- PATCH /comments/VVVVVVVVVVVVVVVVVVV82/Z0sHwoeuagA8JumBKbACX/commentText
			  Request Body:
				{
    				"commentText": "This is an updated reply"
				}
	
	* updateCommentNetLikes
		- route:
			- PATCH /comments/:videoId/:commentId/commentNetLikes?userId=*&increment=*
		- params:
			- videoId (string)
			- commentId (string)
		- query params:
			- userId (string, id of the liker)
			- increment (boolean)
		- returns:
			- updated commentNetLikes
		- example:
			- /comments/VVVVVVVVVVVVVVVVVVV82/LD0vXzg1hD8GHidYJUHq0/commentNetLikes?userId=UUUUUUUUUUUUUUUUUUUU1&increment=true
	
	Method: DELETE
	* deleteComment
		- route:
			- DELETE /comments/:videoId/:commentId?userId=*
		- params:
			- videoId (string)
			- commentId (string)
		- query params:
			- userId (string)
		- returns:
			- if the comment is a root comment, this returns the root comment and
			  its attached replies (in an array, where the first item is the root comment), 
			  otherwise this returns the reply.
		- example:
			- /comments/VVVVVVVVVVVVVVVVVVV82/HW3WsUzA_f7-RVWxw7ahY?userId=UUUUUUUUUUUUUUUUUUUU1
*/

var express = require("express");
var router = express.Router();

const db = require("../config/db.config");
const CommentsRepository = require("../repositories/comments.repository");
const CommentController = require("../controllers/comments.controller");
const CommentModel = require("../models/comments.model");
const CommentErrors = require("../error/comments.error");
const CommentValidators = require("../validators/comments.validator");
const CommentConstants = require("../config/constants/comments.constants");

const commentsRepository = new CommentsRepository(db, CommentErrors);
const commentController = new CommentController(
	commentsRepository,
	CommentModel,
	CommentErrors,
	new CommentValidators(CommentErrors, CommentConstants)
);

router.post("/:videoId/:commentId", commentController.createReply);
router.post("/:videoId", commentController.createComment);

router.get("/:videoId/total", commentController.readVideoTotalNumberOfComments);
router.get("/:videoId/:commentId/replies", commentController.readReplies);
router.get("/:videoId/:commentId", commentController.readComment);
router.get("/:videoId", commentController.readComments);

router.patch("/:videoId/:commentId/commentText", commentController.updateCommentText);
router.patch("/:videoId/:commentId/commentNetLikes", commentController.updateCommentNetLikes);

router.delete("/:videoId/:commentId", commentController.deleteComment);

module.exports = router;
