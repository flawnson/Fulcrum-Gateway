import * as TypeGraphQL from "type-graphql";
import { Organizer } from "../../../models/Organizer";
import { Queue } from "../../../models/Queue";
import { OrganizerQueuesArgs } from "./args/OrganizerQueuesArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Organizer)
export class OrganizerRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => [Queue], {
    nullable: false
  })
  async queues(@TypeGraphQL.Root() organizer: Organizer, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: OrganizerQueuesArgs): Promise<Queue[]> {
    return getPrismaFromContext(ctx).organizer.findUnique({
      where: {
        id: organizer.id,
      },
    }).queues(args);
  }
}
