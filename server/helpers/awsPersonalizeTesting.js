const aws = require("./awsPersonalizeHelpers");

popularityTest = async () => {
  let result = await aws.getPopularVideos("33GSA2sYIbBljuMx8Xg0z");
  console.log(result);
};

getRankingTest = async () => {
  let result = await aws.getRanking("kh2bu158k9YMfFHEzoaR6", ["-cmJynxLLQ9uPiXE0HKqb", "-qxYQ7h2xXfIxRZ9QMrrX", "-KdLdLfkOO18eNKmDo9US"]);
  console.log(result);
}

getUserPersonalization = async () => {
  let result = await aws.userPersonalization("");
  console.log(result);
}

// 6cWxHvzZ2vkX3ChUKBYUf-fZjnt : Cooking Video; line 890

similarVideosTest = async () => {
  let result = await aws.getSimilarVideos("6cWxHvzZ2vkX3ChUKBYUf");
  console.log(result);
};

simsVideosTest = async () => {
  let result = await aws.getSimsVideos("6cWxHvzZ2vkX3ChUKBYUf");
  console.log(result);
};

getUserPersonalization();
