import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import { Context } from "../../../context.interface";
import * as helpers from "../../../helpers";
import _ from 'lodash'
import { userAccessPermission } from "../../../middleware/userAccessPermission";


@ArgsType()
class DeferUserArgs {
  @Field({
    nullable: true
  })
  userId?: string;

  @Field(
    type => Int,
    {
      nullable: false
    }
  )
  timeNeeded!: number;
}

@Resolver()
export class DeferUserResolver {

  @Authorized()
  @UseMiddleware(userAccessPermission)
  @Mutation(returns => User, {
    nullable: true
  })
  async deferPosition(@Ctx() ctx: Context, @Args() args: DeferUserArgs): Promise<User | null> {
    return await ctx.prisma.$transaction(async (prisma) => {
      let queryUserId = "";

      if (ctx.req.session!.userId) {
        queryUserId = ctx.req.session!.userId;
      }

      if (args.userId) {
        queryUserId = args.userId;
      }

      // first get the user
      const userToDefer = await prisma.user.findUnique({
        where: {
          id: queryUserId,
        },
        include: {
          queue: {
            include: {
              users: {
                where: {
                  index: {
                    gt: 0
                  }
                }
              }
            }
          }
        }
      });

      if (userToDefer == null){
        console.log("Cannot defer: User does not exist!");
        return null;
      }

      if (userToDefer.status == "SERVICED"){
        console.log("Cannot defer: User is not ENQUEUED.");
        return null;
      }

      // get users in the same queue
      let allUsers = userToDefer.queue.users;

      // sort by estimated wait in ascending order
      allUsers.sort((a, b) => a.index - b.index);

      // calculate the wait diff
      let deferUserIndex = userToDefer.index;
      let swapIndex = -1; // the index of the user that will get bumped up when deferred user is swapped in
      let totalTimeDiff = 0.0;
      // note allUsers is sorted so "i" will track the index
      for (let i = 1; i <= allUsers.length; i++){
        // if this user is after the defer user
        if (allUsers[i - 1].index > deferUserIndex){
          // calculate time diff
          const e1 = await helpers.calculateEstimatedWait(allUsers[i - 1])
          const e2 = await helpers.calculateEstimatedWait(allUsers[deferUserIndex - 1]);

          // if estimated wait is null
          if (!e1 || !e2){
            console.log("Cannot defer position: Queue has not started service.");
            return null;
          }

          totalTimeDiff +=  e1 - e2;
          if (totalTimeDiff > args.timeNeeded){
            // this is the position to swap into
            swapIndex = allUsers[i - 1].index;
            break;
          }
        }
      }

      // if we get to the end and we haven't found a swap index then the swap index is just the last index
      if (swapIndex === -1){
        swapIndex = allUsers[allUsers.length - 1].index;
      }

      let deferredUser = allUsers[deferUserIndex - 1];
      // bump up the rest of the users
      for (let i = deferUserIndex; i < swapIndex; i++){
        allUsers[i - 1] = allUsers[i];
        allUsers[i - 1]["index"] -= 1;
      }
      // swap in the deferred user
      allUsers[swapIndex - 1] = deferredUser;
      allUsers[swapIndex - 1]["index"] = swapIndex;

      // update all users in the queue with their new index
      for (let u = 0; u < allUsers.length; u++){
        const updatedUser = await prisma.user.update({
          where: {
            id: allUsers[u].id
          },
          data: {
            index: allUsers[u].index
          }
        });
      }

      return userToDefer;
    })

  }
}
