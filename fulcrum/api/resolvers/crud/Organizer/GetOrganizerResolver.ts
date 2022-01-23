import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware
} from "type-graphql";
import { Organizer } from "../../../generated/type-graphql/models/Organizer";
import { Context } from "../../../context.interface";
import * as helpers from "../../../helpers";
import { queueAccessPermission } from "../../../middleware/queueAccessPermission";


@Resolver()
export class GetOrganizerResolver {

  @Authorized("ORGANIZER")
  @Query(returns => Organizer , {
    nullable: true
  })
  async getOrganizer(@Ctx() ctx: Context): Promise<Organizer | null> {

    const queryOrganizerId = ctx.req.session.organizerId;

    const organizer = await ctx.prisma.organizer.findUnique({
      where: {
        id: queryOrganizerId
      }
    });

    return organizer;

  }
}
