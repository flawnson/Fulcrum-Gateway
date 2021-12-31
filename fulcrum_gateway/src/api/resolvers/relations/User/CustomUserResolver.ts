import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg,
  InputType, Field,
  Authorized
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { UserStatus } from "@prisma/client";
import * as helpers from "../../../helpers";
import { Context } from "../../../context.interface";


@Resolver(of => User)
export class CustomUserResolver {

  @Authorized()
  @FieldResolver(type => Int, { nullable: true })
  async estimated_wait(@Root() user: User, @Ctx() {prisma}: Context): Promise<number | null> {
    // calculate average wait time
    const averageWaitTime = await helpers.calculateAverageWait(user.queue_id);

    if (averageWaitTime == null){
      return null;
    }

    // calculate current wait time
    const currentTime = new Date();
    const joinTime = user.join_time;
    const currentWait = parseInt("" + ((currentTime.valueOf() - joinTime.valueOf()) / 1000));

    // estimated_wait = average_wait - current _wait (if negative then just say 0 seconds)
    let estimatedWait = averageWaitTime - currentWait;
    if (estimatedWait < 0){
      estimatedWait = 0;
    }
    return estimatedWait;
  }

  @Authorized("ORGANIZER")
  @FieldResolver(type => String, { nullable: false })
  async status(@Root() user: User, @Ctx() {prisma}: Context): Promise<string | null> {
    // if user is summoned
    if (user.summoned) {

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
