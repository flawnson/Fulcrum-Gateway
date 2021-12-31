import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized
} from "type-graphql";
import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import { Prisma } from "@prisma/client";

import { Context } from "../../../context.interface";

// @ArgsType()
// class DeleteQueueArgs {
//   @Field({
//     nullable: false
//   })
//   id!: string;
// }

@Resolver()
export class DeleteQueueResolver {

  @Authorized("ORGANIZER")
  @Mutation(returns => Queue, {
    nullable: true
  })
  async deleteQueue(@Ctx() { req, prisma }: Context): Promise<Queue | null> {

    if (!req.session.queueId){
      return null;
    }

    // First delete all users in the queue
    const deleteUsers = prisma.user.deleteMany({
      where: {
        queue_id: req.session.queueId,
      },
    })

    // Then delete the queue itself
    const deleteQueue = prisma.queue.delete({
      where: {
        id: req.session.queueId,
      },
    })

    try {
      const transaction = await prisma.$transaction([deleteUsers, deleteQueue]);
      return transaction[1]; //return the deleted Queue
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          console.log('Queue with id ' + req.session.queueId + ' does not exist');
        }
      }
      return null; // return null if error
    }


  }

}
