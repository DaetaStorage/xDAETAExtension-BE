import { TwitterApi } from "twitter-api-v2";

// Instantiate with desired auth type (here's Bearer v2 auth)
const twitterClient = new TwitterApi(process.env.ACCESS_TOKEN as string);

// Tell typescript it's a readonly app
const readOnlyClient = twitterClient.readOnly;

// Get user info by x username (handle)
export const getUserByUsername = async (username: string) => {
  try {
    // Play with the built in methods
    // const user = await readOnlyClient.v2.userByUsername("littlestar601");
    const user = await readOnlyClient.v2.userByUsername(username);

    return user.data.id;
  } catch (error) {
    console.error("Error in getting user by username: ", error);
    return null;
  }
};

// Get Tweets by User
export const getTweetsByUserId = async (userId: string) => {
  try {
    const tweets = await readOnlyClient.v2.userTimeline(userId);

    if (!tweets.data) return null;

    return tweets.data.data;
  } catch (error) {
    console.error("Error in getting tweets by user id: ", error);
    return null;
  }
};
