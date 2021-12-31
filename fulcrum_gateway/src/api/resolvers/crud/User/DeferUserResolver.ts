import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { Context } from "../../../context.interface";
import * as helpers from "../../../helpers";

@ArgsType()
class DeferUserArgs {
  @Field({
    nullable: false
  })
  userId!: string;

  @Field({
    nullable: false
  })
  time!: string;
}

@Resolver()
export class DeferUserResolver {

  @Authorized()
  @Mutation(returns => User, {
    nullable: true
  })
  async deferPosition(@Ctx() { req, prisma }: Context, @Args() args: DeferUserArgs): Promise<User | null> {

    if (!req.session.userId){
      //if userid does not exist then an organizer is calling this
      //if organizer defers user then they need to make sure user exists in queue
      if (!req.session.queueId){
          return null;
      }
      //check if the user you would to change is in the queue you own
      const exists = await helpers.userExistsInQueue(args.userId, req.session.queueId);
      if (exists === false){
        return null;
      }

    }

    // May need to import CustomUserResolver to access estimated_wait()

    // const new_wait = await this.estimated_wait(user, {prisma})
    // const result = await prisma.user.update({
    //   where: {
    //     id: user.id
    //   },
    //   data: {
    //     state: "DEFERRED",
    //     estimated_wait: new_wait
    //   }
    // })
    // return result
    return null;
  }
}
