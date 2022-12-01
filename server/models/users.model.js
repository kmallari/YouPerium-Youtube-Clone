const { nanoid } = require("nanoid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const aws = require("../helpers/awsHelpers");

class User {
	constructor(userData) {
		this.userId = userData.userId || nanoid(21);
		this.username = userData.username || "";
		this.userProfilePicture = userData.userProfilePicture || "profilePlaceholder";
		this.email = userData.email || "";
		this.userPassword = userData.userPassword || "";
		this.firstName = userData.firstName || "";
		this.lastName = userData.lastName || "";
		this.age = userData.age || 0;
		this.channelName = userData.channelName || this.username;
		this.channelDescription = userData.channelDescription || "";
		this.channelBanner = userData.channelBanner || "";
		this.subscribersCount = userData.subscribersCount || 0;
		this.totalViews = userData.totalViews || 0;
		this.createdAt = userData.createdAt || Math.floor(Date.now()/1000);
	}

	getId() {
		return this.userId;
	}

	async getUserDetails() {
		return {
			userId: this.userId,
			userProfilePicture: this.userProfilePicture,
			username: this.username,
			email: this.email,
			firstName: this.firstName,
			lastName: this.lastName,
			userPassword: await this.constructor.hashPassword(
				this.userPassword
			),
			age: this.age,
			channelName: this.channelName,
			channelDescription: this.channelDescription,
			channelBanner: this.channelBanner,
			subscribersCount: this.subscribersCount,
			totalViews: this.totalViews,
			createdAt: this.createdAt,
		};
	}

	static async loginUser(
		identifier,
		identifierData,
		inputPassword,
		repository,
		errors
	) {
		let data;
		let expiresIn = "1d";
		let message = "Login successful";
		if (identifier === "username") {
			data = await repository.loginUserByUsername(identifierData);
		}
		if (identifier === "email") {
			data = await repository.loginUserByEmail(identifierData);
		}
		if (identifier === "userId") {
			data = await repository.loginUserByUserId(identifierData);
			expiresIn = "15m";
			message = "Identity Confirmed";
		}
		if (!data[0][0][0]) {
			throw errors.UserNotFoundError();
		}

		const isPasswordValid = await this.comparePassword(
			inputPassword,
			data[0][0][0].userPassword
		);
		if (!isPasswordValid) {
			throw errors.InvalidPasswordError();
		}

		console.log("Expires in: ", expiresIn);
		return {
			message: message,
			data: {
				userId: data[0][0][0].userId,
				token: await this.getToken(data[0][0][0].userId, expiresIn),
			},
		};
	}

	generateSubscriptionId(subscribeeId) {
		return this.userId.slice(0, 10).concat(subscribeeId.slice(10, 21));
	}

	generateSubscriptionData(channel) {
		return {
			subscriptionId: this.generateSubscriptionId(channel.userId),
			subscriberId: this.userId,
			subscribeeId: channel.userId,
			subscribeeChannelName: channel.channelName,
			subscribeePicture: channel.userProfilePicture,
			createdAt: Math.floor(Date.now()/1000),
		};
	}

	static async getToken(userId, expiresIn) {
		console.log(expiresIn);
		return `${jwt.sign({ userId, sessionId: nanoid(21) }, process.env.JWT_SECRET, {
			expiresIn: expiresIn,
		})}`;
	}

	static async hashPassword(password) {
		return bcrypt.hash(password, 10);
	}

	static async comparePassword(password, hash) {
		return bcrypt.compare(password, hash);
	}

    async uploadProfilePicture(image) {
		this.userProfilePicture = nanoid(21);
		console.log("new userProfilePicture:", this.userProfilePicture);
        await aws().uploadProfilePicture(this.userProfilePicture, image);
    }

	getProfilePicture() {
		return aws().getProfilePicture(this.userProfilePicture)
	}

    async uploadChannelBanner(image) {
		this.channelBanner = nanoid(21);
		console.log("new userProfilePicture:", this.channelBanner);
        await aws().uploadProfilePicture(this.channelBanner, image);
    }

	getChannelBanner() {
		return aws().getProfilePicture(this.channelBanner)
	}
}

module.exports = User;
