import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { QueueOrderByWithAggregationInput } from "../../../inputs/QueueOrderByWithAggregationInput";
import { QueueScalarWhereWithAggregatesInput } from "../../../inputs/QueueScalarWhereWithAggregatesInput";
import { QueueWhereInput } from "../../../inputs/QueueWhereInput";
import { QueueScalarFieldEnum } from "../../../../enums/QueueScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByQueueArgs {
  @TypeGraphQL.Field(_type => QueueWhereInput, {
    nullable: true
  })
  where?: QueueWhereInput | undefined;

  @TypeGraphQL.Field(_type => [QueueOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: QueueOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [QueueScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "join_code" | "name" | "address" | "state" | "capacity" | "max_party_size" | "grace_period" | "offline_time" | "create_time" | "password" | "organizer_id">;

  @TypeGraphQL.Field(_type => QueueScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: QueueScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
