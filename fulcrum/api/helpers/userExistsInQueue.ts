import prisma from '../prismaClient';

export async function userExistsInQueue(userId: string, queueId: string){
  //check if the user exists in the queue
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    }
  });

  if (result == null){
    console.log("User does not exist");
    return false;
  }

  if (result.queue_id != queueId){
    console.log("User does not exist in your queue");
    return false;
  }

  return true;
}
