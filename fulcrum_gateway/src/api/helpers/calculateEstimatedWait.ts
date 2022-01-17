import * as helpers from ".";
import { User } from "../../../prisma/generated/type-graphql/models/User";

export async function calculateEstimatedWait(user: User){
  // calculate average wait time
  const averageWaitTime = await helpers.calculateAverageWait(user.queue_id);

  if (averageWaitTime == null){
    return null;
  }

  const estimatedWait = averageWaitTime * user.index;
  return estimatedWait;

}
