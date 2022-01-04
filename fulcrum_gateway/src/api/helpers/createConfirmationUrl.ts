import { v4 } from "uuid";
import { redis } from "../redisClient";
import { confirmOrganizerPrefix } from "../constants";


export const createConfirmationUrl = async (organizerId: string) => {
  const token = v4();
  await redis.set(confirmOrganizerPrefix + token, organizerId, "ex", 60 * 60 * 12); // 12 hour expiration

  if (process.env.NODE_ENV === "production"){
    // TODO: FILL THIS IN
    // RETURN PRODUCTION URL
  }

  //development
  return `http://localhost:3000/organizer/confirm/${token}`; //fill in with correct URL
};