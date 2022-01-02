import { v4 } from "uuid";
import { redis } from "../redisClient";

export const createConfirmationUrl = async (userId: string) => {
  const token = v4();
  await redis.set(token, userId, "ex", 60 * 60 * 12); // 12 hour expiration

  if (process.env.NODE_ENV === "production"){
    // TODO: FILL THIS IN
    // RETURN PRODUCTION URL
  }

  //development
  return `http://localhost:3000/organizer/confirm/${token}`; //fill in with correct URL
};
