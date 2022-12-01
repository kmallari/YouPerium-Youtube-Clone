const { nanoid } = require("nanoid");
const _ = require("lodash");
const {
	PersonalizeEventsClient,
	PutEventsCommand,
	PutItemsCommand,
	PutUsersCommand,
} = require("@aws-sdk/client-personalize-events");
const {
	PersonalizeRuntimeClient,
	GetRecommendationsCommand,
	GetPersonalizedRankingCommand
} = require("@aws-sdk/client-personalize-runtime");

const personalizeRuntime = new PersonalizeRuntimeClient({
	region: "us-west-2",
	credentials: {
		accessKeyId: process.env.PERSONALIZED_RUNTIME_ACCESS_KEY,
		secretAccessKey: process.env.PERSONALIZED_RUNTIME_SECRET_ACCESS_KEY,
	},
});
const personalizeEvents = new PersonalizeEventsClient({
	region: "us-west-2",
	credentials: {
		accessKeyId: process.env.PERSONALIZED_EVENTS_ACCESS_KEY,
		secretAccessKey: process.env.PERSONALIZED_EVENTS_SECRET_KEY,
	},
});

// PUT USERS/ EVENTS/ VIDEOS ARNS

const userDatasetArn =
	"arn:aws:personalize:us-west-2:443736785131:dataset/cw-internship-2022/USERS";

// EVENTS Tracking ID
const trackingId = "0aaf1e1c-9daa-4502-a7df-40385e26c3c4"

const itemDatasetArn =
	"arn:aws:personalize:us-west-2:443736785131:dataset/cw-internship-2022/ITEMS";

// non user based: recommended videos for anybody. however, userId is still required
const popularityCountCampaignArn =
	"arn:aws:personalize:us-west-2:443736785131:campaign/cw-internship-2022-popularity-campaign";

const rankingCampaign =
	"arn:aws:personalize:us-west-2:443736785131:campaign/cw-internship-2022-ranking-campaign";

// Items similar to a video
const similarItemsCampaignArn =
  "arn:aws:personalize:us-west-2:443736785131:campaign/cw-internship-2022-similar-items-campaign";

// Next video to watch
const simsCampaignArn =
  "arn:aws:personalize:us-west-2:443736785131:campaign/cw-internship-2022-sims-campaign";

// for homepage
const userPersonalizationCampaignArn = "arn:aws:personalize:us-west-2:443736785131:campaign/cw-internship-2022-personalization-campaign"

const awsHelper = {

  userPersonalization: (userId) => {
    // if walang user id, magpasa na lang ng hardcoded ng guest-<nanoid>
    // get a list of personalized items
		let campaignArn = userPersonalizationCampaignArn;
		return new Promise((resolve, reject) => {
			const input = {
				campaignArn: campaignArn,
				userId: userId,
			};
			const getRecommendationsCommand = new GetRecommendationsCommand(
				input
			);
			personalizeRuntime
				.send(getRecommendationsCommand)
				.then((result) => {
					if (result && result.itemList) {
						resolve(result.itemList);
					} else {
						reject("No recommendations");
					}
				})
				.catch((err) => {
					reject(err);
				});
		});
	},

	getPopularVideos: (userId) => {
		// Returns the same list for each user,
		// but userId is required in the input.
		let campaignArn = popularityCountCampaignArn;
		return new Promise((resolve, reject) => {
			const input = {
				campaignArn: campaignArn,
				userId: userId,
				offset: 25,
				limit:10
			};
			const getRecommendationsCommand = new GetRecommendationsCommand(
				input
			);
			personalizeRuntime
				.send(getRecommendationsCommand)
				.then((result) => {
					if (result && result.itemList) {
						resolve(result.itemList);
					} else {
						reject("No recommendations");
					}
				})
				.catch((err) => {
					reject(err);
				});
		});
	},
	
	getRanking: (userId, itemIds) => {
		let campaignArn = rankingCampaign;
		return new Promise((resolve, reject) => {
			const input = {
				campaignArn: campaignArn,
				userId: userId,
				inputList: itemIds
			};
			const getRecommendationsCommand = new GetPersonalizedRankingCommand(
				input
			);
			personalizeRuntime
				.send(getRecommendationsCommand)
				.then((result) => {
					if (result.personalizedRanking !== undefined) {
						resolve(result.personalizedRanking);
					} else {
						reject("No recommendations");
					}
				})
				.catch((err) => {
					reject(err);
				});
		});
	},
	getSimilarVideos: (itemId) => {
		let campaignArn = similarItemsCampaignArn;
		return new Promise((resolve, reject) => {
			const input = {
				campaignArn: campaignArn,
				itemId: itemId,
			};
			const getRecommendationsCommand = new GetRecommendationsCommand(
				input
			);
			personalizeRuntime
				.send(getRecommendationsCommand)
				.then((result) => {
					if (result && result.itemList) {
						resolve(result.itemList);
					} else {
						reject("No recommendations");
					}
				})
				.catch((err) => {
					reject(err);
				});
		});
	},

	getSimsVideos: (itemId) => {
		let campaignArn = simsCampaignArn;
		return new Promise((resolve, reject) => {
			const input = {
				campaignArn: campaignArn,
				itemId: itemId,
			};
			const getRecommendationsCommand = new GetRecommendationsCommand(
				input
			);
			personalizeRuntime
				.send(getRecommendationsCommand)
				.then((result) => {
					if (result && result.itemList) {
						resolve(result.itemList);
					} else {
						reject("No recommendations");
					}
				})
				.catch((err) => {
					reject(err);
				});
		});
	},

	putEvents: (_event) => {
    let event = {
      eventType : _event.eventType,
      itemId : _event.itemId,
      sentAt : new Date(_event.sentAt),
    }
	console.log(event)
	return new Promise((resolve, reject) => {
		const putEventsCommand = new PutEventsCommand({
			eventList : [event],
			sessionId : _event.sessionId,
			trackingId : trackingId,
			userId : _event.userId
		});
		personalizeEvents
			.send(putEventsCommand)
			.then((result) => {
				resolve(result);
			})
			.catch((err) => {
				reject(err);
			});
	});
	},

	putUsers: (_user) => {
    
		const userProperties = {
			AGE: `${_user.age}`
		};

		const user = {
			userId: _user.userId,
			properties: JSON.stringify(userProperties),
		};

    console.log(user);

		return new Promise((resolve, reject) => {
			const putUsersCommand = new PutUsersCommand({
				datasetArn: userDatasetArn,
				users: [user],
			});
			personalizeEvents
				.send(putUsersCommand)
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					reject(err);
				});
		});
	},

	postVideo: (_video) => {
    
		const videoProperties = {
			GENRES: _video.videoCategory,
			CREATION_TIMESTAMP: _video.videoCreatedAt
		};

		const video = {
			itemId: _video.videoId,
			properties: videoProperties,
		};

    	console.log("Posting ", video);

		return new Promise((resolve, reject) => {
			const putItemsCommand = new PutItemsCommand({
				datasetArn: itemDatasetArn,
				items: [video],
			});
			personalizeEvents.send(putItemsCommand)
			.then((result) => {
				console.log(result);
				resolve(result);
			})
			.catch((err) => {
				reject(err);
			});
		});
	},
};

module.exports = awsHelper;
