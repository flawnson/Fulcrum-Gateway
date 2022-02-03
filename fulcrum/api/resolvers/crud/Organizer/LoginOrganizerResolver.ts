import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";

import { Organizer } from "../../../generated/type-graphql/models/Organizer";
import bcrypt from "bcryptjs";
import { Context } from "../../../context.interface";
import { errors } from "../../../constants";
import { OrganizerResult } from "../../../types";

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
  @Mutation(returns => OrganizerResult, { nullable: true })
  async loginOrganizer(@Ctx() ctx: Context, @Args() args: LoginOrganizerArgs): Promise<typeof OrganizerResult> {
    const organizer = await ctx.prisma.organizer.findUnique({
      where: {
        email: args.email
      }
    });

    if (!organizer) {
      console.log("Organizer with this email does not exist: " + args.email);
      let error = {
        error: errors.ORGANIZER_DOES_NOT_EXIST
      };
      return error;
    }

    const valid = await bcrypt.compare(args.password, organizer.password);

    if (!valid) {
      console.log("Incorrect password for organizer " + args.email);
      let error = {
        error: errors.INCORRECT_PASSWORD
      };
      return error;
    }

    if (!organizer.confirmed) {
      console.log("Organizer's account is not confirmed: " + args.email);
      let error = {
        error: errors.ORGANIZER_NOT_VERIFIED
      };
      return error;
    }

    ctx.req.session!.organizerId = organizer.id;

    return organizer;
  }

}
