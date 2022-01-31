import prisma from '../prismaClient';

export async function calculateAverageWait(queueId: string){
  // get users of queue
  const results = await prisma.queue.findUnique({
    where: {
      id: queueId
    },
    select: {
      users: true
    }
  }) || { "users": [] };

  // loop through users to calculate the average wait
  let averageWaitTime = 0;
  let numUsersCount = 0;
  for (let i = 0; i < results.users.length; i++){
    if (results.users[i] != null){
      if (results.users[i].finish_time != null){
        // get total time taken
        const totalWait = parseInt("" + ((results.users[i].finish_time!.valueOf() - results.users[i].join_time.valueOf()) / 1000))
        averageWaitTime += totalWait;
        numUsersCount++;
      }

      // if (results.users[i].total_wait != null){
      //   averageWaitTime += results.users[i].total_wait!; // possibly null if no "!" is used
      //   numUsersCount++;
      // }
    }
  }

  if (numUsersCount == 0){
    return null;
  }

  averageWaitTime /= numUsersCount;

  return averageWaitTime;
}
