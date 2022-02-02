import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware,
  ObjectType,
  createUnionType
} from "type-graphql";
import { User } from "../../../generated/type-graphql/models/User";
import { Queue } from "../../../generated/type-graphql/models/Queue";
import { Context } from "../../../context.interface";
import * as helpers from "../../../helpers";
import { userAccessPermission } from "../../../middleware/userAccessPermission";
import { UserResult } from "../../../types";
import { errors } from "../../../constants";
import { UserStatus } from '@prisma/client'

@ArgsType()
class TimeDeferUserArgs {
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

@ArgsType()
class IndexDeferUserArgs {
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
  numSpots!: number;
}


@Resolver()
export class DeferUserResolver {


  @Authorized()
  @UseMiddleware(userAccessPermission)
  @Mutation(returns => UserResult, {
    nullable: true
  })
  async indexDeferPosition(@Ctx() ctx: Context, @Args() args: IndexDeferUserArgs): Promise<typeof UserResult> {
    return await ctx.prisma.$transaction(async (prisma) => {
      let queryUserId = "";

      if (ctx.req.session!.userId) {
        queryUserId = ctx.req.session!.userId;
      }

      if (args.userId) {
        queryUserId = args.userId;
      }

      // first get the user to defer
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
                },
                orderBy: {
                  index: 'asc',
                },
                select: {
                  id: true,
                  index: true,
                  status: true
                }
              }
            }
          }
        }
      });

      if (userToDefer == null){
        console.log("Cannot defer: User does not exist!");
        let error = {
          error: errors.USER_DOES_NOT_EXIST
        };
        return error;
      }

      if (userToDefer.status == "SERVICED"){
        console.log("Cannot defer: User is not ENQUEUED.");
        let error = {
          error: errors.USER_NOT_ENQUEUED
        };
        return error;
      }

      // get users in the same queue
      let allUsers = userToDefer.queue.users;

      const deferUserIndex = userToDefer.index;
      let swapUserIndex = userToDefer.index + args.numSpots;

      // if beyond the max index in queue, set to last
      if (swapUserIndex > allUsers[allUsers.length - 1].index){
        swapUserIndex = allUsers[allUsers.length - 1].index;
      }

      // update the deferred user's status
      allUsers[deferUserIndex - 1].status = UserStatus.DEFERRED;

      // swap index
      allUsers[deferUserIndex - 1].index = swapUserIndex;
      allUsers[swapUserIndex - 1].index = deferUserIndex;

      // swap
      let temp = allUsers[deferUserIndex - 1];
      allUsers[deferUserIndex - 1] = allUsers[swapUserIndex - 1];
      allUsers[swapUserIndex - 1] = temp;

      // update prisma
      for (let u = 0; u < allUsers.length; u++){
        const updatedUser = await prisma.user.update({
          where: {
            id: allUsers[u].id
          },
          data: {
            index: allUsers[u].index,
            status: allUsers[u].status
          }
        });
      }

      return userToDefer;
    })
  }

  @Authorized()
  @UseMiddleware(userAccessPermission)
  @Mutation(returns => UserResult, {
    nullable: true
  })
  async timeDeferPosition(@Ctx() ctx: Context, @Args() args: TimeDeferUserArgs): Promise<typeof UserResult> {
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
        let error = {
          error: errors.USER_DOES_NOT_EXIST
        };
        return error;
      }

      if (userToDefer.status == "SERVICED"){
        console.log("Cannot defer: User is not ENQUEUED.");
        let error = {
          error: errors.USER_NOT_ENQUEUED
        };
        return error;
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
      const e2 = await helpers.calculateEstimatedWait(allUsers[deferUserIndex - 1]);
      for (let i = 1; i <= allUsers.length; i++){
        // if this user is after the defer user
        if (allUsers[i - 1].index > deferUserIndex){
          // calculate time diff
          const e1 = await helpers.calculateEstimatedWait(allUsers[i - 1])
          // if estimated wait is null
          if (!e1 || !e2){
            console.log("Cannot defer position: Queue has not started service.");
            let error = {
              error: errors.QUEUE_NOT_IN_SERVICE
            };
            return error;
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
      // update the deferred user's status
      allUsers[deferUserIndex - 1].status = UserStatus.DEFERRED;

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
            index: allUsers[u].index,
            status: allUsers[u].status
          }
        });
      }

      return userToDefer;
    })

  }
}
