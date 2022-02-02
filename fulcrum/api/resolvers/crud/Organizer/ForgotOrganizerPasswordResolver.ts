import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";
import { redis } from "../../../redisClient";
import { Organizer } from "../../../generated/type-graphql/models/Organizer";
import { sendEmail, createResetUrl } from "../../../helpers";
import { Context } from "../../../context.interface";
import { errors } from "../../../constants";
import { OrganizerResult } from "../../../types";

@ArgsType()
class ForgotOrganizerPasswordArgs {
  @Field({
    nullable: false
  })
  email!: string;
}

@Resolver()
export class ForgotOrganizerPasswordResolver {
  @Mutation(returns => OrganizerResult)
  async forgotOrganizerPassword(@Ctx() ctx: Context, @Args() args: ForgotOrganizerPasswordArgs): Promise<typeof OrganizerResult> {
    const organizer = await ctx.prisma.organizer.findUnique({
      where: {
        email: args.email
      }
    });

    if (!organizer) {
      console.log("Can't reset password");
      let error = {
        error: errors.ORGANIZER_DOES_NOT_EXIST
      };
      return error;
    }

    await sendEmail(args.email, await createResetUrl(organizer.id), "reset");

    return organizer;
  }

}
