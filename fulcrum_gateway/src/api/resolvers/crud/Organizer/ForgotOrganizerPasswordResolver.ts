import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";
import { redis } from "../../../redisClient";
import { Organizer } from "../../../../../prisma/generated/type-graphql/models/Organizer";
import { sendEmail, createResetUrl } from "../../../helpers";
import { Context } from "../../../context.interface";


@ArgsType()
class ForgotOrganizerPasswordArgs {
  @Field({
    nullable: false
  })
  email!: string;
}

@Resolver()
export class ForgotOrganizerPasswordResolver {
  @Mutation(() => Boolean)
  async forgotOrganizerPassword(@Ctx() ctx: Context, @Args() args: ForgotOrganizerPasswordArgs): Promise<boolean> {
    const organizer = await ctx.prisma.organizer.findUnique({
      where: {
        email: args.email
      }
    });

    if (!organizer) {
      console.log("Can't reset password");
      return false;
    }

    await sendEmail(args.email, await createResetUrl(organizer.id), "reset");

    return true;
  }

}
