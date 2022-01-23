import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";
import { Organizer } from "../../../generated/type-graphql/models/Organizer";
import { Min, Max } from "class-validator";
import Redis from "redis";
import bcrypt from "bcryptjs";
import { Context } from "../../../context.interface";
import { IsEmail } from "class-validator";
import { IsEmailAlreadyExist, sendEmail, createConfirmationUrl } from "../../../helpers";


@ArgsType()
class CreateOrganizerArgs {

  @Field({
    nullable: false
  })
  name!: string;

  @Field({
    nullable: false
  })
  @IsEmail()
  @IsEmailAlreadyExist()
  email!: string;

  @Field({
    nullable: false
  })
  password!: string;

}

@Resolver()
export class CreateOrganizerResolver {

  @Mutation(returns => Organizer, {
    nullable: true
  })
  async createOrganizer(@Ctx() ctx: Context, @Args() args: CreateOrganizerArgs): Promise<Organizer | null> {
    const hashedPassword = await bcrypt.hash(args.password, 12);

    const organizer = await ctx.prisma.organizer.create({
      data: {
        name: args.name,
        email: args.email,
        password: hashedPassword,
        confirmed: false
      }
    });

    if (organizer != null){
      await sendEmail(args.email, await createConfirmationUrl(organizer.id), "confirm");
    }
    else {
      console.log("Can't send confirmation email: Organizer account failed to create. ")
    }

    return organizer;
  }


}
