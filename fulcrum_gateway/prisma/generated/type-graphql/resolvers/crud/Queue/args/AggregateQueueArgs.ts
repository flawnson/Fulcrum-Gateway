import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { QueueOrderByWithRelationInput } from "../../../inputs/QueueOrderByWithRelationInput";
import { QueueWhereInput } from "../../../inputs/QueueWhereInput";
import { QueueWhereUniqueInput } from "../../../inputs/QueueWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateQueueArgs {
  @TypeGraphQL.Field(_type => QueueWhereInput, {
    nullable: true
  })
  where?: QueueWhereInput | undefined;

  @TypeGraphQL.Field(_type => [QueueOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: QueueOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => QueueWhereUniqueInput, {
    nullable: true
  })
  cursor?: QueueWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
