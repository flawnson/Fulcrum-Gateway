import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";

import { Organizer } from "../../../../../prisma/generated/type-graphql/models/Organizer";
import bcrypt from "bcryptjs";
import { Context } from "../../../context.interface";

@ArgsType()
class LoginOrganizerArgs {
  @Field({
    nullable: false
  })
  email!: string;

  @Field({
    nullable: false
  })
  password!: string;
}

@Resolver()
export class LoginOrganizerResolver {
  @Mutation(() => Organizer, { nullable: true })
  async loginOrganizer(@Ctx() ctx: Context, @Args() args: LoginOrganizerArgs): Promise<Organizer | null> {
    const organizer = await ctx.prisma.organizer.findUnique({
      where: {
        email: args.email
      }
    });

    if (!organizer) {
      return null;
    }

    const valid = await bcrypt.compare(args.password, organizer.password);

    if (!valid) {
      return null;
    }

    ctx.req.session!.organizerId = organizer.id;

    return organizer;
  }

}
