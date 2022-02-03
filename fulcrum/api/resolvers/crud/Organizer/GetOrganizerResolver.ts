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
import { errors } from "../../../constants";
import { OrganizerResult } from "../../../types";

@Resolver()
export class GetOrganizerResolver {

  @Authorized("ORGANIZER")
  @Query(returns => OrganizerResult , {
    nullable: true
  })
  async getOrganizer(@Ctx() ctx: Context): Promise<typeof OrganizerResult> {

    const queryOrganizerId = ctx.req.session.organizerId;

    const organizer = await ctx.prisma.organizer.findUnique({
      where: {
        id: queryOrganizerId
      }
    });

    if(!organizer){
      let error = {
        error: errors.ORGANIZER_DOES_NOT_EXIST
      };
      return error;
    }

    return organizer;

  }
}
