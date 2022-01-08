import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { Context } from "../../../context.interface";
import { sendSMS } from "../../../helpers";

@ArgsType()
class CreateUserArgs {
  @Field({
    nullable: false
  })
  joinCode!: string;

  @Field({
    nullable: false
  })
  phoneNumber!: string;

  @Field({
    nullable: false
  })
  name!: string;
}

@Resolver()
export class CreateUserResolver {

  @Mutation(returns => User, {
    nullable: true
  })
  async createUser(@Ctx() ctx: Context, @Args() args: CreateUserArgs): Promise<User | null> {
    // make queries atomic so they immediately follow one another (prevents joining a queue that just got deleted)
    return await ctx.prisma.$transaction(async (prisma) => {
      //check if theres a queue with that join code
      const result = await prisma.queue.findUnique({
        where: {
          join_code: args.joinCode,
        },
        include: {
          users: true
        }
      });

      if (result == null) {
        console.log("Cannot join: Queue with code " + args.joinCode + " does not exist.");
        return null;
      }

      if (result.state == "INACTIVE" || result.state == "PAUSED"){
        console.log("Cannot join: Queue with code " + args.joinCode + " is INACTIVE or PAUSED.");
        return null;
      }

      // calculate the user's index
      const index = result.users.length + 1;
      const currentTime = new Date();
      const queueId = result.id;
      // create a new user
      const createUser = await prisma.user.create({
        data: {
          name: args.name,
          queue_id: queueId,
          phone_number: args.phoneNumber,
          join_time: currentTime,
          index: index
        }
      });


      if (createUser != null){
        // generate verification code


        // send SMS here
        //await sendSMS(args.phoneNumber);
        
        // create session
        ctx.req.session!.userId = createUser.id;
      }
      return createUser;

    })
  }


}
