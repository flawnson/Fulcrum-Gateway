import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg,
  InputType, Field,
  Authorized
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { PrismaClient, UserStatus} from "@prisma/client";
import * as helpers from "../../../helpers";

interface Context {
  prisma: PrismaClient;
}

@InputType({ description: "Data needed to defer user" })
class DeferData implements Partial<User> {
  @Field()
  id?: string;

  @Field()
  time?: string;
}

@Resolver(of => User)
export class CustomUserResolver {

  @Authorized()
  @FieldResolver(type => Int, { nullable: true })
  async estimated_wait(@Root() user: User, @Ctx() {prisma}: Context): Promise<number | null> {
    // calculate average wait time
    const estimatedWait = await helpers.calculateEstimatedWait(user);
    return estimatedWait;
  }

  @Authorized()
  @FieldResolver(type => Int, { nullable: true })
  async estimated_eta(@Root() user: User, @Ctx() {prisma}: Context): Promise<number | null> {
    // calculate average wait time
    const eta = await helpers.calculateETA(user);
    return eta;
  }

  @Authorized()
  @FieldResolver(type => String, { nullable: false })
  async status(@Root() user: User, @Ctx() {prisma}: Context): Promise<string | null> {
    // if user is summoned
    if (user.summoned === true) {

      // get the queue that the user is in
      const queue = await prisma.queue.findUnique({
        where: {
          id: user.queue_id,
        },
        select: {
          grace_period: true
        }
      })

      if (queue == null){
        // queue doesn't exist for some reason error
        console.log("Queue does not exist: " + user.queue_id);
        return null;
      }

      // if current time - summoned_time > grace_period, then update status to NOSHOW
      if (queue.grace_period != null){
        const currentTime = new Date();
        const timeDiff = parseInt("" + ((currentTime.valueOf() - user.summoned_time!.valueOf()) / 1000));
        console.log("User " + user.id + " is being set to NOSHOW");
        console.log("Current time: " + currentTime.valueOf());
        console.log("Summoned time: " + user.summoned_time!.valueOf());
        console.log("Time difference: " + timeDiff);
        console.log("Summoned state: " + user.summoned);
        console.log("Original status: " + user.status);
        console.log("Grace period: " + queue.grace_period);
        console.log("Index of User: " + user.index);
        if (timeDiff > queue.grace_period) {
          const updatedUser = await helpers.updateUserStatus(user.id, UserStatus.NOSHOW);
          return UserStatus.NOSHOW;
        }
      }

    }

    // otherwise return status
    return user.status!; //user's status will always exist as long as they're queued
  }



}
