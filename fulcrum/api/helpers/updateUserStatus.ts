import prisma from '../prismaClient';
import { UserStatus } from '@prisma/client'

export async function updateUserStatus(userId: string, newStatus: UserStatus){
  return await prisma.$transaction(async (prisma) => {
    // get the user's current status
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (user != null){

      const leaveStatus = ["SERVICED", "ABANDONED", "NOSHOW", "KICKED"];

      // if it's a leave status and the user's original status isn't a leave status, update the total_wait
      if (leaveStatus.includes(newStatus) && (user.status == UserStatus.ENQUEUED || user.status == UserStatus.DEFERRED)){

        // total_wait = time of leave - join_time (in seconds)
        const leaveTime = new Date();
        const joinTime = user.join_time;
        const totalWait = parseInt("" + ((leaveTime.valueOf() - joinTime.valueOf()) / 1000));

        // set user's index to 0 as a default value
        // also set summoned to false, summoned_time to null
        const updateUser = await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            status: newStatus,
            total_wait: totalWait,
            summoned: false,
            summoned_time: null,
            index: 0
          }
        });

        // also update all users in the queue behind them with their index - 1 (move up in the queue)
        const originalUserIndex = user.index;
        const userQueueId = user.queue_id;
        const updateOtherUsers = await prisma.user.updateMany({
          where: {
            index : {
              gt: originalUserIndex,
            },
            queue_id: userQueueId
          },
          data: {
            index: {
              increment: -1
            }
          }
        });

        return updateUser;

      }

    }

    return null;
  })
}
