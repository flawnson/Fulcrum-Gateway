import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";
import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import { Min, Max } from "class-validator";
import Redis from "redis";
import bcrypt from "bcryptjs";
import { Context } from "../../../context.interface";


@ArgsType()
class CreateQueueArgs {

  @Field({
    nullable: false
  })
  name!: string;

  @Field({
    nullable: false
  })
  address!: string;

  @Field({
    nullable: false
  })
  organizerId!: string;

  @Field(type => Int, {
    nullable: false
  })
  @Min(0)
  capacity!: number;

  @Field(type => Int, {
    defaultValue: 1
  })
  @Min(1)
  maxPartySize?: number;

  @Field(type => Int, {
    nullable: true
  })
  gracePeriod?: number;

  @Field(type => Int, {
    nullable: true
  })
  offlineTime?: number;

  @Field({
    nullable: false
  })
  password!: string;

}

@Resolver(of => Queue)
export class CreateQueueResolver {

  @Mutation(returns => Queue, {
    nullable: true
  })
  async createQueue(@Ctx() { req, prisma }: Context, @Args() args: CreateQueueArgs): Promise<Queue | null> {

    return await prisma.$transaction(async (prisma) => {
      // generate 6 digit join code
      let joinCode = (+new Date * Math.random()).toString(36).substring(0,6);

      //check if this join code is already in use by a queue
      while (true) {
        const results = await prisma.queue.findUnique({
          where: {
            join_code: joinCode,
          }
        });

        if (results == null) {
          // join code is available
          break;
        } else {
          // join code is unavailable, generate new one
          joinCode = (+new Date * Math.random()).toString(36).substring(0,6);
        }
      }

      // create a new queue
      // hash password
      const hashedPassword = await bcrypt.hash(args.password, 12);

      const createTime = new Date();
      const createQueue = await prisma.queue.create({
        data: {
          name: args.name,
          join_code: joinCode,
          address: args.address,
          organizer_id: args.organizerId,
          capacity: args.capacity,
          max_party_size: args.maxPartySize,
          grace_period: args.gracePeriod,
          offline_time: args.offlineTime,
          create_time: createTime,
          password: hashedPassword,
          users: {
            create: []
          },
        },
        include: {
          users: true,
        },
      });
      req.session!.queueId = createQueue.id
      return createQueue;

    })
  }


}
