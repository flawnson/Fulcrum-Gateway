import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByOrganizerArgs } from "./args/GroupByOrganizerArgs";
import { Organizer } from "../../../models/Organizer";
import { OrganizerGroupBy } from "../../outputs/OrganizerGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Organizer)
export class GroupByOrganizerResolver {
  @TypeGraphQL.Query(_returns => [OrganizerGroupBy], {
    nullable: false
  })
  async groupByOrganizer(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByOrganizerArgs): Promise<OrganizerGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).organizer.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
