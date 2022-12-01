const { S3Client, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");

const config = {
    Bucket: 'interns-major-app-2022',
    region: 'ap-southeast-1'
}
        
const s3 = new S3Client(
    {
        region: config.region,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
    }
)
const awsHelper = () => {

    const getProfilePicture = (imageId) => {
        const url = `https://interns-major-app-2022.s3.${config.region}.amazonaws.com/user-photos/${imageId}.jpg`;
        return url;
    }

    const getVideo = (videoId) => {
        const url = `https://interns-major-app-2022.s3.${config.region}.amazonaws.com/videos/${videoId}.mp4`;
        return url;
    }

    const getVideoThumbnail = (imageId) => {
        const url = `https://interns-major-app-2022.s3.${config.region}.amazonaws.com/video-thumbnails/${imageId}.jpg`;
        return url;
    }

    const uploadProfilePicture = async (imageId, image) => {
        try {
            const file = image.buffer;
            const uploadParams = {
                Bucket: config.Bucket,
                Key: `user-photos/${imageId}.jpg`,
                ContentType: 'image/jpeg',
                Body: file,
                ACL: 'public-read'
            };
            const data = await s3.send(new PutObjectCommand(uploadParams));
            console.log("Successfully uploaded photo:", data);
        } catch (error) {
            console.error(error)
            return `There was an error uploading your photo.`;
        }
    }

    const uploadVideo = async (videoId, video) => {
        try {
            const file = video.buffer;
            const uploadParams = {
                Bucket: config.Bucket,
                Key: `videos/${videoId}.mp4`,
                ContentType: 'video/mp4',
                Body: file,
                ACL: 'public-read'
            };
            await s3.send(new PutObjectCommand(uploadParams));
        } catch (error) {
            return `There was an error uploading your video.`;
        }
    }

    const uploadVideoThumbnail = async (imageId, image) => {
        try {
            const file = image.buffer;
            const uploadParams = {
                Bucket: config.Bucket,
                Key: `video-thumbnails/${imageId}.jpg`,
                ContentType: 'image/jpeg',
                Body: file,
                ACL: 'public-read'
            };
            await s3.send(new PutObjectCommand(uploadParams));
        } catch (error) {
            return `There was an error uploading your photo.`;
        }
    }

    return {
        getProfilePicture: getProfilePicture,
        getVideo: getVideo,
        getVideoThumbnail: getVideoThumbnail,
        uploadProfilePicture: uploadProfilePicture,
        uploadVideo: uploadVideo,
        uploadVideoThumbnail: uploadVideoThumbnail
    }
}

module.exports = awsHelper;