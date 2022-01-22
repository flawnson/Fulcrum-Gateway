import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateOrganizerArgs } from "./args/AggregateOrganizerArgs";
import { Organizer } from "../../../models/Organizer";
import { AggregateOrganizer } from "../../outputs/AggregateOrganizer";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Organizer)
export class AggregateOrganizerResolver {
  @TypeGraphQL.Query(_returns => AggregateOrganizer, {
    nullable: false
  })
  async aggregateOrganizer(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateOrganizerArgs): Promise<AggregateOrganizer> {
    return getPrismaFromContext(ctx).organizer.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
