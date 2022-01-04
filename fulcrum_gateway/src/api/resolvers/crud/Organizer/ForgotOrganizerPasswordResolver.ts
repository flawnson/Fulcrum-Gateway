import { Resolver, Mutation, Arg } from "type-graphql";

import { redis } from "../../../redisClient";
import { Organizer } from "../../../../../prisma/generated/type-graphql/models/Organizer";
import { sendEmail, createResetUrl } from "../../../helpers/sendEmail";
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
  async forgotOrganizerPassword(@Ctx() { req, prisma }: Context, @Args() args: ForgotOrganizerPasswordArgs): Promise<boolean> {
    const organizer = await prisma.organizer.findUnique({
      where: {
        email: args.email
      }
    });

    if (!organizer) {
      return false;
    }

    await sendEmail(email, await createResetUrl(organizer.id), "reset");

    return true;
  }

}
