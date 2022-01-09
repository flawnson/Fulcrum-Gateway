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
      console.log("Organizer with this email does not exist: " + args.email);
      return null;
    }

    const valid = await bcrypt.compare(args.password, organizer.password);

    if (!valid) {
      console.log("Incorrect password for organizer " + args.email);
      return null;
    }

    if (!organizer.confirmed) {
      console.log("Organizer's account is not confirmed: " + args.email);
      return null;
    }

    ctx.req.session!.organizerId = organizer.id;

    return organizer;
  }

}
