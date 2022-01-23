import * as helpers from ".";
import { User } from "../generated/type-graphql/models/User";

export async function calculateETA (user: User) {
  const estimatedWait = await helpers.calculateEstimatedWait(user);

  if (estimatedWait == null){
    return null;
  }

  // calculate current wait time
  const currentTime = new Date();
  const joinTime = user.join_time;
  const currentWait = parseInt("" + ((currentTime.valueOf() - joinTime.valueOf()) / 1000));

  const eta = estimatedWait - currentWait;
  return eta;
}
