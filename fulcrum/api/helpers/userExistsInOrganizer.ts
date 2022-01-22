import prisma from '../prismaClient';

export async function userExistsInOrganizer(userId: string, organizerId: string){
  //check if the user exists in queue that the organizer owns
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      queue: true
    }
  });

  if (result == null){
    console.log("User does not exist");
    return false;
  }

  if (result.queue == null){
    console.log("User's Queue does not exist");
    return false;
  }

  if (result.queue.organizer_id != organizerId){
    console.log("User's Queue does not exist in organizer");
    return false;
  }

  return true;
}
