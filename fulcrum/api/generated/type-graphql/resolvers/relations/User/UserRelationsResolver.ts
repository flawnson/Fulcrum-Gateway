import * as TypeGraphQL from "type-graphql";
import { Queue } from "../../../models/Queue";
import { User } from "../../../models/User";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => User)
export class UserRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => Queue, {
    nullable: false
  })
  async queue(@TypeGraphQL.Root() user: User, @TypeGraphQL.Ctx() ctx: any): Promise<Queue> {
    return getPrismaFromContext(ctx).user.findUnique({
      where: {
        id: user.id,
      },
    }).queue({});
  }
}
