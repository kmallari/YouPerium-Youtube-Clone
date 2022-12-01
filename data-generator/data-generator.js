const ArgumentParser = require('argparse').ArgumentParser;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { nanoid } = require('nanoid');
const csv = require('csv-parser');
const fs = require('fs');
const _ = require('lodash');

const parser = new ArgumentParser({
    add_help: true,
    description: 'Data Generator'
});
  
parser.add_argument(
    '--type', {
      help: 'data to generate',
      default: 'users'
    }
);

parser.add_argument(
    '--usersConfig', {
      help: 'users data config',
      default: '{"count": 25}'
    }
);

parser.add_argument(
    '--videosConfig', {
      help: 'videos data config',
      default: '{"Cooking": {"count": 1000}, \
                "Documentary": {"count": 1000}, \
                "Gaming": {"count": 1000}, \
                "Music": {"count": 1000}, \
                "Sports": {"count": 1000}}'
    }
);

parser.add_argument(
    '--interactionsConfig', {
      help: 'interactions data config',
      default: '{"usersDataPath": "./generated-data/users.csv", "videosDataPath": "./generated-data/videos.csv",\
      "oneVideoToManyUsersCategories": ["Music"]}'
    }
);
// usersPerMake: { "Ford": 5, "Toyota": 5, "Honda": 5, "Chevrolet": 5, "Nissan": 5 }
// oneVehicleToManyUsersMakes: ["Ford"]

const config = parser.parse_args();

let csvWriter;

getRandomNumber = function(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    );
}

generateUsers = async function(usersCount) {
    const users = [];
    const firstNames = ['James', 'Robert', 'John', 'Mike', 'David', 'Will', 'Max', 'Joseph', 'Thomas', 'Carl',
                        'Mary', 'Pat', 'Jen', 'Linda', 'Liz', 'Emma', 'Susan', 'Jess', 'Sarah', 'Karen'];
    const lastNames = ['Smith', 'Webb', 'Hale', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Pierce', 'West'];
    const currTime = Math.floor(Date.now()/1000);
    const threeMonthsAgo = currTime - 7776000;

    for(let i = 0; i < usersCount; i++) {
        const userId = nanoid(21);
        const userProfilePicture = nanoid(21);
        const firstName = firstNames[getRandomNumber(0, firstNames.length - 1)];
        const lastName = lastNames[getRandomNumber(0, lastNames.length - 1)];
        const username = `${firstName}${lastName}${userId.slice(userId.length-3)}`;
        
        const channelName = `${lastName}${userId.slice(userId.length-3)}Channel`;
        const channelDescription = `${firstName} ${lastName}'s Channel`;
        const channelBanner = nanoid(21);

        let user;
        user = {
            userId: userId,
            userProfilePicture: userProfilePicture,
            username: username,
            userPassword: '$2a$10$zx/W/4SP/9ZiXCTkZAf8XOaGq3GyhnIdS6ZXvGv1Y6CK5h/oNSEOm',
            email: `${username}@gmail.com`,
            firstName: firstName,
            lastName: lastName,
            age: 25,
            channelName: channelName,
            channelDescription: channelDescription,
            channelBanner: channelBanner,
            subscribersCount: 0,
            totalViews: 0,
            createdAt: threeMonthsAgo            
        }
        users.push(user);
    }

    return users;
}

generateVideos = async function(videosToGenerate, users) {
    const videos = [];
    const categories = Object.keys(videosToGenerate);
    const currTime = Math.floor(Date.now()/1000);
    const threeMonthsAgo = currTime - 7776000;

    for (const category of categories) {
        const videosCount = videosToGenerate[category].count;
        let videoTitle, videoDuration, videoFile;
        
        switch (category) {
            case 'Cooking': {
                videoTitle = 'How To Prepare A Squash';
                videoDuration = 60;
                videoFile = 'https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/videos/cooking.mp4';
                break;
            }
            case 'Documentary': {
                videoTitle = 'The Philippines in 1 Minute';
                videoDuration = 66;
                videoFile = 'https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/videos/documentary.mp4';
                break;
            }
            case 'Gaming': {
                videoTitle = 'The Faker Roll';
                videoDuration = 23;
                videoFile = 'https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/videos/gaming.mp4';
                break;
            }
            case 'Music': {
                videoTitle = 'closer, the chainsmokers';
                videoDuration = 58;
                videoFile = 'https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/videos/music.mp4'
                break;
            }
            case 'Sports': {
                videoTitle = 'Fencing is an Elegant Sport';
                videoDuration = 59;
                videoFile = 'https://interns-major-app-2022.s3.ap-southeast-1.amazonaws.com/videos/sports.mp4'
                break;
            }
            default: {
                videoTitle = 'Placeholder';
                break;
            }
        }

        for(let i = 0; i < videosCount; i++) {
            const randomNumber = getRandomNumber(0, users.length - 1);
            const user = users[randomNumber];
            const video = {
                videoId: nanoid(21),
                videoThumbnailId: nanoid(21),
                videoTitle: videoTitle,
                videoDescription: `Seed video for ${category}`,
                videoCategory: category,
                videoCreatedAt: threeMonthsAgo*1000,
                videoTotalViews: 0,
                videoDuration: videoDuration,
                userId: user.USER_ID,
                channelName: user.CHANNEL_NAME,
                subscribersCount: user.SUBSCRIBERS_COUNT,
                userProfilePicture: user.USER_PROFILE_PICTURE,
                videoFile: videoFile
            }
    
            videos.push(video);
        }
    }

    return videos;
}

generateInteractions = async function(users, videos) {
    const videoCategories = _.uniq(_.map(videos, 'VIDEO_CATEGORY'));
    const userGroups = {};
    const videoGroups = {};
    const interactions = [];

    const currTime = Math.floor(Date.now()/1000);
    const twoMonthsAgo = currTime - 5184000;
    let incrementTime = twoMonthsAgo;

    // Divide the videos into groups based on their category
    for (const category of videoCategories) {
        const videoGroup = _.filter(videos, (item) => {
            return item.VIDEO_CATEGORY === category;
        })
        videoGroups[category] = videoGroup;
    }

    // Divide users into different groups (different categories)
    const interactionsConfig = JSON.parse(config.interactionsConfig);
    if (interactionsConfig.usersPerCategory) {
        const configUsersPerCategory = interactionsConfig.usersPerCategory;
        let userIndex = 0;
        for (const category of Object.keys(configUsersPerCategory)) {
            const usersPerCategory = configUsersPerCategory[category];
            const userGroup = user.slice(userIndex, userIndex + usersPerCategory);
            userGroups[category] = userGroup;
            userIndex += usersPerCategory;
        }
    } else {
        const usersPerCategory = Math.floor(users.length / videoCategories.length);
        for (let i = 0; i < users.length; i += usersPerCategory) {
            const userGroup = users.slice(i, i+ usersPerCategory);
            const category = videoCategories[Math.floor(i/usersPerCategory)];
            userGroups[category] = userGroup;
        }
    }

    // Generate Interactions
    for (const userGroup of Object.keys(userGroups)) {
        const userGroupUsers = userGroups[userGroup];
        const videosForUserGroup = videoGroups[userGroup];

        const videosPerUser = Math.ceil(videosForUserGroup.length / userGroupUsers.length);
        for (let i = 0; i < videosForUserGroup.length; i += videosPerUser) {
            const userVideos = videosForUserGroup.slice(i, i + videosPerUser);
            
            for (const video of userVideos) {
                let timestamp;
                if (config.dateTimeMode ==='random') {
                    timestamp = getRandomNumber(twoMonthsAgo, currTime);
                } else if (config.dateTimeMode === 'increment') {
                    timestamp = incrementTime;
                    incrementTime += 5*60;
                } else {
                    timestamp = currTime;
                }

                let videoUsers = [];
                if (interactionsConfig.oneVideoToManyUsersCategories && interactionsConfig.oneVideoToManyUsersCategories.includes(userGroup)) {
                    videoUsers = userGroupUsers;
                } else {
                    videoUsers = [userGroupUsers[Math.floor(i/videosPerUser)]]
                }

                for (const videoUser of videoUsers) {
                    const interaction = {
                        userId: videoUser.USER_ID,
                        videoId: video.VIDEO_ID,
                        eventName: 'viewed',
                        timestamp: timestamp
                    }                    
    
                    interactions.push(interaction);
                }
            }
        }
    }

    return interactions;
}

sleep = function(waitTimeout) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, waitTimeout);
    })
}

start = async function() {
    let dataToGenerate;

    switch(config.type) {
        case 'users': {
            csvWriter = createCsvWriter({
                path: './generated-data/users.csv',
                header: [
                    {id: 'userId', title: 'USER_ID'},
                    {id: 'userProfilePicture', title: 'USER_PROFILE_PICTURE'},
                    {id: 'username', title: 'USERNAME'},
                    {id: 'userPassword', title: 'USER_PASSWORD'},
                    {id: 'email', title: 'EMAIL'},
                    {id: 'firstName', title: 'FIRST_NAME'},
                    {id: 'lastName', title: 'LAST_NAME'},
                    {id: 'age', title: 'AGE'},
                    {id: 'channelName', title: 'CHANNEL_NAME'},
                    {id: 'channelDescription', title: 'CHANNEL_DESCRIPTION'},
                    {id: 'channelBanner', title: 'CHANNEL_BANNER'},
                    {id: 'subscribersCount', title: 'SUBSCRIBERS_COUNT'},
                    {id: 'totalViews', title: 'TOTAL_VIEWS'},
                    {id: 'createdAt', title: 'CREATED_AT'}
                ]
            });

            const usersConfig = JSON.parse(config.usersConfig);
            dataToGenerate = await generateUsers(usersConfig.count);
            break;
        }
        case 'videos': {
            csvWriter = createCsvWriter({
                path: './generated-data/videos.csv',
                header: [
                    {id: 'videoId', title: 'VIDEO_ID'},
                    {id: 'videoThumbnailId', title:'VIDEO_THUMBNAIL_ID'},
                    {id: 'videoTitle', title: 'VIDEO_TITLE'},
                    {id: 'videoDescription', title: 'VIDEO_DESCRIPTION'},
                    {id: 'videoCategory', title: 'VIDEO_CATEGORY'},
                    {id: 'videoCreatedAt', title: 'VIDEO_CREATED_AT'},
                    {id: 'videoTotalViews', title: 'VIDEO_TOTAL_VIEWS'},
                    {id: 'videoDuration', title: 'VIDEO_DURATION'},
                    {id: 'userId', title: 'USER_ID'},
                    {id: 'channelName', title: 'CHANNEL_NAME'},
                    {id: 'subscribersCount', title: 'SUBSCRIBERS_COUNT'},
                    {id: 'userProfilePicture', title: 'USER_PROFILE_PICTURE'},
                    {id: 'videoFile', title: 'VIDEO_FILE'}
                ]
            });

            const videosConfig = JSON.parse(config.videosConfig);
            
            const users = [];
            const usersDataPath = "./generated-data/users.csv"
            let readUsersDataDone = false;
            fs.createReadStream(usersDataPath)
                .pipe(csv())
                .on('data', (data) => {
                    users.push(data);
                })
                .on('end', () => {
                    readUsersDataDone = true;
                });
            while(!readUsersDataDone) {
                await sleep(2000);
            }

            dataToGenerate = await generateVideos(videosConfig, users);
            break;
        }
        case 'interactions': {
            csvWriter = createCsvWriter({
                path: './generated-data/interactions.csv',
                header: [
                    {id: 'userId', title: 'USER_ID'},
                    {id: 'videoId', title: 'VIDEO_ID'},
                    {id: 'eventName', title: 'EVENT_TYPE'},
                    {id: 'timestamp', title: 'TIMESTAMP'}
                ]
            });

            const interactionsConfig = JSON.parse(config.interactionsConfig);
            const users = [];
            const videos = [];
            let readUsersDataDone = false;
            let readVideosDataDone = false;

            fs.createReadStream(interactionsConfig.usersDataPath)
                .pipe(csv())
                .on('data', (data) => {
                    users.push(data);
                })
                .on('end', () => {
                    readUsersDataDone = true;
                });

            fs.createReadStream(interactionsConfig.videosDataPath)
                .pipe(csv())
                .on('data', (data) => {
                    videos.push(data);
                })
                .on('end', () => {
                    readVideosDataDone = true;
                });

            while(!readUsersDataDone || !readVideosDataDone) {
                await sleep(2000);
            }

            dataToGenerate = await generateInteractions(users, videos);
            break;
        }
        default: {
            break;
        }
    }

    if (dataToGenerate) {
        await csvWriter.writeRecords(dataToGenerate);
    }
}

start();