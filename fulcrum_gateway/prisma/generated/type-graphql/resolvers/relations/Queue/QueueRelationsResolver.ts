import * as TypeGraphQL from "type-graphql";
import { Queue } from "../../../models/Queue";
import { User } from "../../../models/User";
import { QueueUsersArgs } from "./args/QueueUsersArgs";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Queue)
export class QueueRelationsResolver {
  @TypeGraphQL.FieldResolver(_type => [User], {
    nullable: false
  })
  async users(@TypeGraphQL.Root() queue: Queue, @TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Args() args: QueueUsersArgs): Promise<User[]> {
    return getPrismaFromContext(ctx).queue.findUnique({
      where: {
        id: queue.id,
      },
    }).users(args);
  }
}
