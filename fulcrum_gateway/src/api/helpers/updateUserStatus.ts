import prisma from '../prismaClient';
import { UserStatus } from '@prisma/client'

export async function updateUserStatus(userId: string, newStatus: UserStatus){

  // update the user's status
  const user = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      status: newStatus
    },
  });

  if (user != null){
    // if it's a leave status, update the total_wait
    const leaveStatus = ["SERVICED", "ABANDONED", "NOSHOW", "KICKED"];
    if (leaveStatus.includes(newStatus)){

      // total_wait = time of leave - join_time (in seconds)
      const leaveTime = new Date();
      const joinTime = user.join_time;
      const totalWait = parseInt("" + ((leaveTime.valueOf() - joinTime.valueOf()) / 1000));

      // also set summoned to false, summoned_time to null
      const updateUser = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          total_wait: totalWait,
          summoned: false,
          summoned_time: null
        }
      });

    }

  }

  return user;

}
