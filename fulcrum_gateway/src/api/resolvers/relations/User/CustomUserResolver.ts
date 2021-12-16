import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg,
  InputType, Field
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { PrismaClient } from "@prisma/client";
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

  @FieldResolver(type => Int, {
    nullable: true
  })
  async estimated_wait(
      @Root() user: User,
      @Ctx() {prisma}: Context,
  ): Promise<number | null> {
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

}
