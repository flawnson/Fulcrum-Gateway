import { v4 } from "uuid";
import { redis } from "../redisClient";
import { forgotOrganizerPasswordPrefix } from "../constants";


export const createResetUrl = async (organizerId: string) => {
  const token = v4();
  await redis.set(forgotOrganizerPasswordPrefix + token, organizerId, "ex", 60 * 60 * 12); // 12 hour expiration

  if (process.env.NODE_ENV === "production"){
    // TODO: FILL THIS IN
    // RETURN PRODUCTION URL
    //for now return the same localhost url
    return `${process.env.FRONTEND_PROD_URL}/organizer/reset/${forgotOrganizerPasswordPrefix + token}`;
  }

  //development
  return `${process.env.FRONTEND_LOCAL_URL}/organizer/reset/${forgotOrganizerPasswordPrefix + token}`; //fill in with correct URL
};
