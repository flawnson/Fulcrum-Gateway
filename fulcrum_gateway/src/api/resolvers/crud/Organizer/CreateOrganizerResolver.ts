import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";
import { Organizer } from "../../../../../prisma/generated/type-graphql/models/Organizer";
import { Min, Max } from "class-validator";
import Redis from "redis";
import bcrypt from "bcryptjs";
import { Context } from "../../../context.interface";
import { sendEmail } from "../../../helpers/sendEmail";
import { createConfirmationUrl } from "../../../helpers/createConfirmationUrl";
import { IsEmail } from "class-validator";
import { IsEmailAlreadyExist } from "../../../helpers/isEmailAlreadyExists";


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
  async createOrganizer(@Ctx() { req, prisma }: Context, @Args() args: CreateOrganizerArgs): Promise<Organizer | null> {
    const hashedPassword = await bcrypt.hash(args.password, 12);

    const organizer = await prisma.organizer.create({
      name: args.name,
      email: args.email,
      password: hashedPassword
    });

    if (organizer != null){
      await sendEmail(email, await createConfirmationUrl(organizer.id), "confirm");
    }

    req.session!.organizerId = organizer.id;
    return organizer;
  }


}
