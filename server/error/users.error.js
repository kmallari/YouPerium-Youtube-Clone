const CustomError = require("./CustomError");
const GlobalError = require("./global.error");

// ERROR RANGE: 1000 - 10000

class UsersError extends GlobalError {
	//
	static PasswordError = () =>
		new CustomError(
			400,
			"Password must contain at least one number, one uppercase letter, one lowercase letter, and must be at least 8 characters long at most 20 characters long",
			1001
		);
	static EmailError = () =>
		new CustomError(400, "Email must be a valid email address", 1002);

	static UsernameError = () =>
		new CustomError(
			400,
			"Username must be at least 3 characters long at most 20 characters long and must contain only letters, numbers",
			1003
		);
	static FirstNameError = () =>
		new CustomError(
			400,
			"First name must be at least 3 characters long at most 64 characters long and must contain only letters",
			1004
		);
	static LastNameError = () =>
		new CustomError(
			400,
			"Last name must be at least 3 characters long at most 64 characters long and must contain only letters",
			1005
		);
	static ChannelNameError = () =>
		new CustomError(
			400,
			"Channel name must be at least 3 characters long at most 64 characters long and must contain only letters, numbers and spaces",
			1006
		);
	static ChannelDescriptionError = () =>
		new CustomError(
			400,
			"Channel description must be at least 3 characters long at most 5000 characters long and must contain only letters, numbers",
			1007
		);

	static AgeError = () =>
		new CustomError(400, "Age must be at least 0 years old", 1008);

	static MissingEmailOrUsernameError = () =>
		new CustomError(400, "Missing email or username", 1009);

	static UserNotFoundError = () =>
		new CustomError(404, "User not found", 1010);

	static UserAlreadyExistsError = () =>
		new CustomError(400, "User already exists", 1011);

	static InvalidPasswordError = () =>
		new CustomError(400, "Invalid password", 1012);

	static ChannelDescriptionError = () =>
		new CustomError(
			400,
			"Channel description must be at least 3 characters long at most 5000 characters long and must contain only letters, numbers, spaces, and punctuation",
			1013
		);
	static PictureError = () =>
		new CustomError(400, "Picture Id must be a valid id", 1014);

	static SubscriptionAlreadyExistsError = () =>
		new CustomError(409, "User already subscribed", 1015);

	static SubscriptionNotFoundError = () =>
		new CustomError(404, "Subscription not found", 1016);

	static FieldExistsError = (field) =>
		new CustomError(409, `${field} already exists`, 1017);
	
}

module.exports = UsersError;
