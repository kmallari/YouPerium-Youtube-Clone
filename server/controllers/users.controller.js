class UsersController {
	constructor(
		usersRepository,
		videosRespository,
		playlistsRepository,
		commentsRepository,
		UserModel,
		UsersErrors,
		validators,
		AWS
	) {
		this.usersRepository = usersRepository;
		this.videosRespository = videosRespository;
		this.playlistsRepository = playlistsRepository;
		this.commentsRepository = commentsRepository;
		this.UserModel = UserModel;
		this.UsersErrors = UsersErrors;
		this.validators = validators;
		this.AWS = AWS;
	}

	async createUser(req, res) {
		try {
			const { username, email, userPassword, firstName, lastName, age } =
				req.body;

			console.log(req.body);

			this.validators.validateCreationPayload(req.body, [
				"username",
				"email",
				"userPassword",
				"firstName",
				"lastName",
				"age",
			]);

			const userData = new this.UserModel({
				username,
				email,
				userPassword,
				firstName,
				lastName,
				age,
			});

			const userEntry = await userData.getUserDetails();

			await this.usersRepository.createUser(userEntry);

			const awsResponse = await this.AWS.putUsers(userEntry);
			console.log(awsResponse);

			res.status(201).json({
				message: "User Created",
				data: {
					userId: userData.getId(),
					token: await this.UserModel.getToken(
						userData.getId(),
						"1d"
					),
				},
			});
		} catch (error) {
			console.log(error);

			res.status(error.code || 400).json({
				message: error.message,
				customCode: error.customCode,
			});
		}
	}

	async patchUser(req, res) {
		try {
			const {
				userProfilePicture,
				username,
				email,
				userPassword,
				firstName,
				lastName,
				age,
				channelName,
				channelDescription,
				channelBanner,
			} = req.body;

			this.validators.validatePatchUserPayload(req.body);

			let hashedPassword;
			if (userPassword) {
				hashedPassword = await this.UserModel.hashPassword(
					userPassword
				);
			}

			const data = await this.usersRepository.patchUser({
				userId: req.user.userId,
				userProfilePicture,
				username,
				userPassword: hashedPassword,
				email,
				firstName,
				lastName,
				age,
				channelName,
				channelDescription,
				channelBanner,
			});

			// Update other entites if channel name
			if (channelName) {
				await this.videosRespository.updateVideoCreatorData(
					req.user.userId,
					channelName || null,
					userProfilePicture || null
				);

				await this.playlistsRepository.updatePlaylistCreatorData(
					req.user.userId,
					channelName || null,
					userProfilePicture || null
				);

				await this.playlistsRepository.updateVideoInPlaylistChannelName(
					channelName || null,
					req.user.channelName
				);

				await this.commentsRepository.updateCommentCreatorData(
					req.user.userId,
					channelName || null,
					userProfilePicture || null
				);

				await this.usersRepository.patchChannelDataForSubscriptions({
					userId: req.user.userId,
					channelName,
					userProfilePicture,
				});
			}

			if (!data[0][0][0]) {
				throw this.UsersErrors.UserNotFoundError();
			}

			if (age) {
				const awsResponse = await this.AWS.putUsers({
					userId: req.user.userId,
					age,
				});

				console.log(awsResponse);
			}

			res.status(200).json({
				message: "User Updated",
				data: {
					...data[0][0][0],
				},
			});
		} catch (error) {
			console.log(error);
			res.status(error.code || 400).json({
				message: error.message,
				customCode: error.customCode,
			});
		}
	}

	async getUserByUserId(req, res) {
		try {
			const { userId } = req.params;
			const data = await this.usersRepository.getUserByUserId(userId);
			if (!data[0][0][0]) {
				throw this.UsersErrors.UserNotFoundError();
			}

			let response = { message: "User retrieved.", data: data[0][0][0] };
			const userData = new this.UserModel(data[0][0][0]);
			if (userData.userProfilePicture)
				response["userProfilePictureLink"] =
					userData.getProfilePicture();
			if (userData.channelBanner)
				response["channelBanner"] = userData.getChannelBanner();

			return res.status(200).json(response);
		} catch (error) {
			res.status(error.code || 400).json({
				message: error.message,
				customCode: error.customCode,
			});
		}
	}

	async getUserByChannelName(req, res, next) {
		try {
			const { channelName } = req.params;
			const data = await this.usersRepository.getUserByChannelName(
				channelName
			);

			if (!data[0][0][0]) {
				throw this.UsersErrors.UserNotFoundError();
			}

			let response = { message: "User retrieved.", data: data[0][0][0] };

			const userData = new this.UserModel(data[0][0][0]);

			if (userData.userProfilePicture)
				response["userProfilePictureLink"] =
					await userData.getProfilePicture();
			if (userData.channelBanner)
				response["channelBanner"] = await userData.getChannelBanner();

			return res.status(200).json(response);
		} catch (error) {
			return res.status(error.code || 400).json({
				message: error.message,
				customCode: error.customCode,
			});
		}
	}

	async loginUser(req, res) {
		try {
			const { username, email, userPassword } = req.body;

			this.validators.validateLoginPayload(req.body);

			if (username) {
				const loginResponse = await this.UserModel.loginUser(
					"username",
					username,
					userPassword,
					this.usersRepository,
					this.UsersErrors
				);
				return res.status(200).json(loginResponse);
			}

			if (email) {
				const loginResponse = await this.UserModel.loginUser(
					"email",
					email,
					userPassword,
					this.usersRepository,
					this.UsersErrors
				);
				return res.status(200).json(loginResponse);
			}
			throw this.UsersErrors.LoginError();
		} catch (error) {
			res.status(error.code || 400).json({
				message: error.message,
				customCode: error.customCode,
			});
		}
	}

	async searchChannels(req, res) {
		try {
			this.validators.checkRequiredQueryParametersExist(req.query, [
				"searchQuery",
				"sortBy",
				"asc",
				"offset",
				"limit",
			]);

			let { searchQuery, sortBy, asc, offset, limit } = req.query;
			asc = asc === "true" ? true : false;

			const searchedChannels = (
				await this.usersRepository.searchChannels(
					searchQuery,
					sortBy,
					asc,
					offset,
					limit
				)
			)[0][0];
			return res.status(200).json({
				message: `Successfully performed the search query '${searchQuery}'`,
				data: searchedChannels,
			});
		} catch (error) {
			res.status(error.code || 400).json({
				message: error.message,
				customCode: error.customCode,
			});
		}
	}

	async subscribeToChannel(req, res) {
		try {
			const { subscribeeChannelName } = req.params;

			const subscriber = new this.UserModel(req.user);
			let data = await this.usersRepository.getUserByChannelName(
				subscribeeChannelName
			);

			if (!data[0][0][0]) {
				throw this.UsersErrors.UserNotFoundError();
			}

			const subscribee = new this.UserModel(data[0][0][0]);

			const subscriptionData =
				subscriber.generateSubscriptionData(subscribee);

			data = await this.usersRepository.getSubscriptionById(
				subscriptionData.subscriptionId
			);

			if (data[0][0][0]) {
				throw this.UsersErrors.SubscriptionAlreadyExistsError();
			}

			data = await this.usersRepository.subscribeToChannel(
				subscriptionData
			);

			await this.videosRespository.incrementVideoCreatorSubscribersCount(
				subscribee.userId
			)

			return res.status(200).json({
				message: "User subscribed to channel.",
				data: {
					subscriptionId: subscriptionData.subscriptionId,
				},
			});
		} catch (error) {
			res.status(error.code || 400).json({
				message: error.message,
				customCode: error.customCode,
			});
		}
	}

	async unsubscribeFromChannel(req, res) {
		try {
			const { subscribeeChannelName } = req.params;

			const subscriber = new this.UserModel(req.user);
			let data = await this.usersRepository.getUserByChannelName(
				subscribeeChannelName
			);
			if (!data[0][0][0]) {
				throw this.UsersErrors.UserNotFoundError();
			}
			const subscribee = new this.UserModel(data[0][0][0]);
			const subscriptionId = subscriber.generateSubscriptionId(
				subscribee.userId
			);

			// check if user is subscribed to channel
			data = await this.usersRepository.getSubscriptionById(
				subscriptionId
			);

			if (!data[0][0][0]) {
				throw this.UsersErrors.SubscriptionNotFoundError();
			}

			data = await this.usersRepository.unsubscribeFromChannel(
				subscriptionId,
				subscribee.getId()
			);

			await this.videosRespository.decrementVideoCreatorSubscribersCount(
				subscribee.userId
			)

			return res.status(200).json({
				message: "User unsubscribed from channel.",
				data: {
					subscribeeId: subscribee.getId(),
				},
			});
		} catch (error) {
			res.status(error.code || 400).json({
				message: error.message,
				customCode: error.customCode,
			});
		}
	}

	async getSubscriptions(req, res) {
		try {
			const { userId } = req.user;
			const data = await this.usersRepository.getSubscriptionsByUserId(
				userId
			);

			return res.status(200).json({
				message: "Subscriptions retrieved.",
				data: data[0][0],
			});
		} catch (error) {
			console.log(error);

			res.status(error.code || 400).json({
				message: error.message,
				customCode: error.customCode,
			});
		}
	}

	async getSubscriptionById(req, res) {
		try {
			const { subscribeeId } = req.params;
			const currentUser = new this.UserModel(req.user);
			const subscriptionId =
				currentUser.generateSubscriptionId(subscribeeId);

			let data = await this.usersRepository.getSubscriptionById(
				subscriptionId
			);

			return res.status(200).json({
				message: "Subscription retrieved.",
				data: {
					subscription: data[0][0].length === 0 ? false : true,
				},
			});
		} catch (error) {
			console.log(error);
			res.status(error.code || 400).json({
				message: error.message,
				customCode: error.customCode,
			});
		}
	}

	async uploadProfilePicture(req, res) {
		try {
			console.log("Uploading thumbnail");

			console.log("req.user.userId", req.user.userId);

			let userData = new this.UserModel({
				userId: req.user.userId,
			});

			await userData.uploadProfilePicture(req.file);

			console.log("userData is", userData, req.user.userId);

			const data = await this.usersRepository.patchUser(userData);

			if (!data[0][0][0]) {
				throw this.UsersErrors.UserNotFoundError();
			}

			await this.videosRespository.updateVideoCreatorData(
				userData.userId,
				null,
				userData.userProfilePicture
			);

			await this.playlistsRepository.updatePlaylistCreatorData(
				userData.userId,
				null,
				userData.userProfilePicture
			);

			await this.commentsRepository.updateCommentCreatorData(
				userData.userId,
				null,
				userData.userProfilePicture
			);

			await this.usersRepository.patchChannelDataForSubscriptions({
				userId: userData.userId,
				channelName: null,
				userProfilePicture: userData.userProfilePicture,
			});

			res.status(200).json({
				message: "Profile Picture uploaded",
				data: {
					userProfilePicture: userData.getProfilePicture(),
				},
			});
		} catch (error) {
			console.error(error);
			/* Return error first for debugging;
			change error code and message later */
			res.status(400).json(error);
		}
	}

	async uploadChannelBanner(req, res) {
		try {
			/*const {
				userProfilePicture,
				username,
				email,
				userPassword,
				firstName,
				lastName,
				age,
				channelName,
				channelDescription,
				channelBanner,
			} = req.body;

			let userData = new this.UserModel(
				req.user.userId,
				userProfilePicture,
				username,
				email,
				userPassword,
				firstName,
				lastName,
				age,
				channelName,
				channelDescription,
				channelBanner
			);*/

			let userData = new this.UserModel({
				userId: req.user.userId,
			});

			await userData.uploadChannelBanner(req.file);

			console.log("userData is", userData);
			console.log(req.file);

			const data = await this.usersRepository.patchUser(userData);

			if (!data[0][0][0]) {
				throw this.UsersErrors.UserNotFoundError();
			}

			res.status(200).json({
				message: "Channel Banner uploaded",
				data: {
					channelBanner: userData.getChannelBanner(),
				},
			});
		} catch (error) {
			console.error(error);
			/* Return error first for debugging;
			change error code and message later */
			res.status(400).json(error);
		}
	}
	async confirmIdentity(req, res) {
		try {
			const { userId } = req.user;
			const { userPassword } = req.body;

			console.log(userId, userPassword);

			const confirmIdentityResponse = await this.UserModel.loginUser(
				"userId",
				userId,
				userPassword,
				this.usersRepository,
				this.UsersErrors
			);

			return res.status(200).json(confirmIdentityResponse);
		} catch (error) {
			console.log(error);

			res.status(error.code || 400).json({
				message: error.message,
				customCode: error.customCode,
			});
		}
	}

	async checkUser(req, res) {
		try {
			const { type } = req.query;
			const { value } = req.body;
			let data;
			switch (type) {
				case "username":
					data = await this.usersRepository.loginUserByUsername(
						value
					);
					break;
				case "email":
					data = await this.usersRepository.loginUserByEmail(value);
					break;
				default:
					throw this.UsersErrors.InvalidUserTypeError();
			}

			return res.status(200).json({
				message: "Field checked.",
				data: {
					user: data[0][0].length === 0 ? false : true,
				},
			});
		} catch (error) {
			console.log(error);
			res.status(error.code || 400).json({
				message: error.message,
				customCode: error.customCode,
			});
		}
	}

	async changePassword(req, res) {
		try {
			const { userId } = req.user;
			const { oldPassword, newPassword } = req.body;

			await this.UserModel.loginUser(
				"userId",
				userId,
				oldPassword,
				this.usersRepository,
				this.UsersErrors
			);

			const data = await this.usersRepository.patchUser({
				userId,
				userPassword: await this.UserModel.hashPassword(newPassword),
			});

			return res.status(200).json({
				message: "Password changed.",
				data: {
					userPassword: newPassword,
				},
			});
		} catch (error) {
			res.status(error.code || 400).json({
				message: error.message,
				customCode: error.customCode,
			});
		}
	}
}

module.exports = UsersController;
