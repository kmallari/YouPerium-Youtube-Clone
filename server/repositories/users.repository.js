class UsersRepository {
	constructor(db, errors) {
		this.db = db;
		this.errors = errors;
	}

	_SQLErrorHandler(error, userData) {
		if (error.code === "ER_DUP_ENTRY") {
			// parse error.sqlMessage using regex to get the duplicate key
			const duplicateKey = /key '(\w+)'/.exec(error.sqlMessage)[1];

			throw this.errors.DuplicateAttributeValue(`${duplicateKey}`);
		}
		throw error;
	}

	async createUser(userData) {
		try {
			return await this.db.raw(
				`CALL CreateUser(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
				[
					userData.userId,
					userData.userProfilePicture,
					userData.username,
					userData.userPassword,
					userData.email,
					userData.firstName,
					userData.lastName,
					userData.age,
					userData.channelName,
					userData.channelDescription,
					userData.channelBanner,
					userData.subscribersCount,
					userData.totalViews,
					userData.createdAt
				]
			);
		} catch (error) {
			console.log(error);
			this._SQLErrorHandler(error, userData);
		}
	}

	async patchUser({
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
	}) {
		try {
			console.log({
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
			})
			return await this.db.raw(
				`CALL PatchUserById(?,?,?,?,?,?,?,?,?,?,?,?)`,
				[
					userId,
					userProfilePicture || null,
					username || null,
					userPassword || null,
					email || null,
					firstName || null,
					lastName || null,
					age || null,
					channelName || null,
					channelDescription || null,
					channelBanner || null,
					subscribersCount || null,
				]
			);
		} catch (error) {
			this._SQLErrorHandler(error);
		}
	}

	async getUserByUserId(userId) {
		try {
			return await this.db.raw(`CALL getUserById(?)`, [userId]);
		} catch (error) {
			this._SQLErrorHandler(error);
		}
	}

	async getUserByChannelName(channelName) {
		try {
			return await this.db.raw(`CALL getUserByChannelName(?)`, [channelName]);
		} catch (error) {
			this._SQLErrorHandler(error);
		}
	}

	async getUserByUsername(username) {
		try {
			return await this.db.raw(`CALL getUserByUsername(?)`, [username]);
		} catch (error) {
			this._SQLErrorHandler(error);
		}
	}

	async loginUserByEmail(email) {
		try {
			return await this.db.raw(`CALL loginUserByEmail(?)`, [email]);
		} catch (error) {
			this._SQLErrorHandler(error);
		}
	}

	async loginUserByUserId(userId) {
		try {
			return await this.db.raw(`CALL loginUserByUserId(?)`, [userId]);
		} catch (error) {
			this._SQLErrorHandler(error);
		}
	}

	async loginUserByUsername(username) {
		try {
			return await this.db.raw(`CALL loginUserByUsername(?)`, [username]);
		} catch (error) {
			this._SQLErrorHandler(error);
		}
	}

	async searchChannels(searchQuery, sortBy, asc, offset, limit) {
		try {
			return await this.db.raw(
				'CALL SearchChannels(?, ?, ?, ?, ?)',
				[searchQuery, sortBy, asc, offset, limit]
			);
		} catch (error) {
			throw this._SQLErrorHandler(error);
		}
	}

	async subscribeToChannel({
		subscriptionId,
		subscriberId,
		subscribeeId,
		subscribeeChannelName,
		subscribeePicture,
		createdAt,
	}) {
		try {
			return await this.db.raw(`CALL SubscribeToChannel(?,?,?,?,?,?)`, [
				subscriptionId,
				subscriberId,
				subscribeeId,
				subscribeeChannelName,
				subscribeePicture,
				createdAt,
			]);
		} catch (error) {
			this._SQLErrorHandler(error);
		}
	}

	async unsubscribeFromChannel(subscriberId, subscribeeId) {
		try {
			return await this.db.raw(`CALL UnsubscribeFromChannel(?,?)`, [
				subscriberId,
				subscribeeId,
			]);
		} catch (error) {
			this._SQLErrorHandler(error);
		}
	}

	async getSubscriptionsByUserId(userId) {
		try {
			return await this.db.raw(`CALL GetSubscriptionsByUserId(?)`, [
				userId,
			]);
		} catch (error) {
			this._SQLErrorHandler(error);
		}
	}

	async getSubscriptionById(subscriptionId) {
		try {
			return await this.db.raw(`CALL GetSubscriptionById(?)`, [
				subscriptionId,
			]);
		} catch (error) {
			this._SQLErrorHandler(error);
		}
	}

	async patchChannelDataForSubscriptions({userId, channelName, userProfilePicture}) {
		try {
			return await this.db.raw(
				`CALL PatchChannelDataForSubscriptions(?,?,?)`,
				[userId, channelName || null, userProfilePicture || null]
			);
		} catch (error) {
			this._SQLErrorHandler(error);
		}
	}
}

module.exports = UsersRepository;

// SAMPLE KNEX CALL

// registerUser: (
//   id,
//   username,
//   email,
//   hashPassword,
//   profilePicture,
//   createdAt
// ) => {
//   return db.raw("CALL RegisterUser(?, ?, ?, ?, ?, ?)", [
//     id,
//     username,
//     email,
//     hashPassword,
//     profilePicture,
//     createdAt,
//   ]);
// },
