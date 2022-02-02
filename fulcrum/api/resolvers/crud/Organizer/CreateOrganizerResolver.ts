import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  createUnionType
} from "type-graphql";
import { Organizer } from "../../../generated/type-graphql/models/Organizer";
import { Min, Max } from "class-validator";
import Redis from "redis";
import bcrypt from "bcryptjs";
import { Context } from "../../../context.interface";
import { IsEmail } from "class-validator";
import { IsEmailAlreadyExist, sendEmail, createConfirmationUrl } from "../../../helpers";
import { OrganizerResult } from "../../../types";
import { errors } from "../../../constants";


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

  @Mutation(returns => OrganizerResult, {
    nullable: true
  })
  async createOrganizer(@Ctx() ctx: Context, @Args() args: CreateOrganizerArgs): Promise<typeof OrganizerResult> {
    return await ctx.prisma.$transaction(async (prisma) => {
      const existingOrganizer = await prisma.organizer.findUnique({
        where: {
          email: args.email
        }
      });

      // organizer already exists
      if (existingOrganizer){
        if (existingOrganizer.confirmed == false){
          // unconfirmed, resend email
          console.log("Organizer with email " + args.email + " already exists but unconfirmed. Resending confirmation email.");
          await sendEmail(args.email, await createConfirmationUrl(existingOrganizer.id), "confirm");
          return existingOrganizer;
        }
        // return error
        console.log("Organizer with email " + args.email + " already exists and confirmed already.");
        let error = {
          error: errors.ORGANIZER_ALREADY_EXISTS
        };
        return error;
      }


      const hashedPassword = await bcrypt.hash(args.password, 12);

      const organizer = await prisma.organizer.create({
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
    })
  }


}
