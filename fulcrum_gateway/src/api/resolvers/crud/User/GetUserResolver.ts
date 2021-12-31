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
class GetUserArgs {
  @Field({
    nullable: true
  })
  userId?: string;
}

@Resolver()
export class GetUserResolver {

  @Authorized()
  @Query(returns => User, {
    nullable: true
  })
  async getUser(@Ctx() { req, prisma }: Context, @Args() args: GetUserArgs): Promise<User | null> {

    // if accessed by organizer
    if (req.session.queueId && args.userId){
      const exists = await helpers.userExistsInQueue(args.userId, req.session.queueId);
      if (exists === false){
        return null;
      }

      // return user
      const user = prisma.user.findUnique({
        where: {
          id: args.userId,
        }
      });

      return user;
    }
    
    // if accessed by user
    if (req.session.userId){
      const user = prisma.user.findUnique({
        where: {
          id: req.session.userId,
        }
      });

      return user;
    }


    return null;



  }
}
