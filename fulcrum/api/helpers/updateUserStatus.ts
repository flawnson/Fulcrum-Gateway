import prisma from '../prismaClient';
import { UserStatus } from '@prisma/client'
import { errors } from "../constants";

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
        // const totalWait = parseInt("" + ((leaveTime.valueOf() - joinTime.valueOf()) / 1000));

        // set user's index to 0 as a default value
        // set their phone number to null
        const updateUser = await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            status: newStatus,
            finish_time: leaveTime,
            index: 0,
            phone_number: null // erase their phone number to allow requeuing
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

    let error = {
      error: errors.USER_DOES_NOT_EXIST
    };
    return error;
  })
}
