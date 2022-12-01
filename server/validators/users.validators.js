const Validators = require("./validator");

class UsersValidators extends Validators {
	constructor(errors) {
		super(errors);
	}

	validateUsername(username, required = false) {
		// username must be at least 3 characters long at most 60 characters long
		// username must contain only letters, numbers
		if (!username && required) {
			throw this.errors.MissingParameter("username");
		}
		if (username) {
			const test = /^[a-zA-Z0-9]{3,60}$/.test(username);
			if (!test) {
				throw this.errors.UsernameError();
			}
		}
		return true;
	}

	validateEmail(email, required = false) {
		// email must be a valid email address

		if (!email && required) {
			throw this.errors.MissingParameter("email");
		}
		if (email) {
			const test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
			if (!test) {
				throw this.errors.EmailError();
			}
		}
		return true;
	}

	validatePassword(password, required = false) {
		// password must be at least 8 characters long at most 20 characters long
		// password must contain at least one number, one uppercase letter, one lowercase letter
		// password can contain special characters

		if (!password && required)
			throw this.errors.MissingParameter("password");

		if (password) {
			const test =
				/^(?=.*[A-Z].)(?=.*[0-9].)(?=.*[a-z].).{8,}$/.test(
					password
				)

			if (!test) {
				throw this.errors.PasswordError();
			}
		}
		return true;
	}

	validateFirstName(firstName, required = false) {
		// firstName must be at least 1 characters long at most 64 characters long
		// firstName must contain only letters and spaces
		if (!firstName && required) {
			throw this.errors.MissingParameter("firstName");
		}
		const test = /^[a-zA-Z\s]{1,64}$/.test(firstName);
		if (!test) {
			throw this.errors.FirstNameError();
		}
		return true;
	}

	validateLastName(lastName, required = false) {
		// lastName must be at least 1 characters long at most 64 characters long
		// lastName must contain only letters
		if (!lastName && required) {
			throw this.errors.MissingParameter("lastName");
		}
		if (lastName) {
			const test = /^[a-zA-Z]{1,64}$/.test(lastName);
			if (!test) {
				throw this.errors.LastNameError();
			}
		}
		return true;
	}

	validateChannelName(channelName, required = false) {
		// channelName must be at least 3 characters long at most 60 characters long
		// channelName must contain only letters, numbers, and spaces
		if (!channelName && required) {
			throw this.errors.MissingParameter("channelName");
		}
		if (channelName) {
			const test = /^[a-zA-Z0-9\s]{3,60}$/.test(channelName);
			if (!test) {
				throw this.errors.ChannelNameError();
			}
		}
		return true;
	}

	validateChannelDescription(description, required = false) {
		// description must be at least 3 characters long at most 5000 characters long
		// description must contain only letters, numbers, spaces, and punctuation
		if (!description && required) {
			throw this.errors.MissingParameter("description");
		}
		if (description) {
			const test = /^[a-zA-Z0-9\s\.,;:'"?!()-]{3,5000}$/.test(description);
			if (!test) {
				throw this.errors.ChannelDescriptionError();
			}
		}
		return true;
	}

	validateAge(age, required = false) {
		if ((!age && required) || age < 0) return false;
		return true;
	}

	validatePictureId(picture, required = false) {
		// pictureid must be of length 21 and contain only letters, numbers, and underscores
		if (!picture && required) {
			throw this.errors.MissingParameter("picture");
		}
		if (picture) {
			const test = /^[a-zA-Z0-9_]{21}$/.test(picture);
			if (!test) {
				throw this.errors.PictureError();
			}
		}
		return true;
	}

	validateCreationPayload(payload, allowedFields) {
		// payload should contain username, email, password, firstName, lastName, age
		try {
			this.checkRequiredParametersExist(payload, allowedFields);

			return (
				this.validateUsername(payload.username, true) &&
				this.validateEmail(payload.email, true) &&
				this.validatePassword(payload.userPassword, true) &&
				this.validateFirstName(payload.firstName, true) &&
				this.validateLastName(payload.lastName, true) &&
				this.validateAge(payload.age, true)
			);
		} catch (err) {
			throw err;
		}
	}

	validateLoginPayload(payload, allowedFields) {
		// payload should contain email or username

		try {
			const test =
				(payload.email && this.validateEmail(payload.email)) ||
				(payload.username && this.validateUsername(payload.username));

			if (!test) {
				throw this.errors.MissingParameter("email or username");
			}

			return true;
		} catch (err) {
			throw err;
		}
	}

	validatePatchUserPayload(payload) {
		try {
			return (
				this.validateUsername(payload.username) &&
				this.validatePictureId(payload.userProfilePicture) &&
				this.validateEmail(payload.email) &&
				this.validatePassword(payload.userPassword) &&
				this.validateFirstName(payload.firstName) &&
				this.validateLastName(payload.lastName) &&
				this.validateAge(payload.age) &&
				this.validateChannelName(payload.channelName) &&
				this.validateChannelDescription(payload.channelDescription) &&
				this.validatePictureId(payload.channelBanner)
			);
		} catch (err) {
			throw err;
		}
	}
}

module.exports = UsersValidators;
