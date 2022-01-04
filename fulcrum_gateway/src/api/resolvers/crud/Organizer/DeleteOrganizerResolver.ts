import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware
} from "type-graphql";

import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import { Prisma } from "@prisma/client";

import { Context } from "../../../context.interface";

@Resolver()
export class DeleteOrganizerResolver {

  @Authorized("ORGANIZER")
  @Mutation(returns => Organizer, {
    nullable: true
  })
  async deleteOrganizer(@Ctx() { req, prisma }: Context): Promise<Organizer | null> {

    if (!req.session.organizerId){
      return null;
    }

    // Delete the organizer (cascades automatically)
    const deleteOrganizer = await prisma.organizer.delete({
      where: {
        id: req.session.organizerId,
      },
    })

    return deleteOrganizer;

  }

}
