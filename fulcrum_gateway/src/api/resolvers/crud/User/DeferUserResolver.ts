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
    nullable: true
  })
  userId?: string;

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
  async deferPosition(@Ctx() ctx: Context, @Args() args: DeferUserArgs): Promise<User | null> {

    // if accessed by organizer
    if (ctx.req.session.queueId && args.userId){
      const exists = await helpers.userExistsInQueue(args.userId, ctx.req.session.queueId);
      if (exists === false){
        return null;
      }

      // TODO: defer logic

    }

    // if accessed by user
    if (ctx.req.session.userId){
      // TODO: defer logic
    }

    return null;


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

  }
}
