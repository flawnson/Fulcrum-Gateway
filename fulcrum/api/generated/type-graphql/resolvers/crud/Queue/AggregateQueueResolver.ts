import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateQueueArgs } from "./args/AggregateQueueArgs";
import { Queue } from "../../../models/Queue";
import { AggregateQueue } from "../../outputs/AggregateQueue";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Queue)
export class AggregateQueueResolver {
  @TypeGraphQL.Query(_returns => AggregateQueue, {
    nullable: false
  })
  async aggregateQueue(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateQueueArgs): Promise<AggregateQueue> {
    return getPrismaFromContext(ctx).queue.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
