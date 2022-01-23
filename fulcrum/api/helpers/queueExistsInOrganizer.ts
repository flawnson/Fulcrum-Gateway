import prisma from '../prismaClient';

export async function queueExistsInOrganizer(queueId: string, organizerId: string){
  //check if the queue exists in the organizer
  const result = await prisma.queue.findUnique({
    where: {
      id: queueId
    }
  });

  if (result == null){
    console.log("Queue does not exist");
    return false;
  }


  if (result.organizer_id != organizerId){
    console.log("Queue does not exist in organizer");
    return false;
  }

  return true;
}
