import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware
} from "type-graphql";

import { Organizer } from "../../../../../prisma/generated/type-graphql/models/Organizer";
import { Prisma } from "@prisma/client";

import { Context } from "../../../context.interface";

@Resolver()
export class DeleteOrganizerResolver {

  @Authorized("ORGANIZER")
  @Mutation(returns => Organizer, {
    nullable: true
  })
  async deleteOrganizer(@Ctx() ctx: Context): Promise<Organizer | null> {

    if (!ctx.req.session.organizerId){
      return null;
    }

    // Delete the organizer (cascades automatically)
    const deleteOrganizer = await ctx.prisma.organizer.delete({
      where: {
        id: ctx.req.session.organizerId,
      },
    })

    return deleteOrganizer;

  }

}
