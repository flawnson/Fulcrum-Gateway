import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueAvgOrderByAggregateInput } from "../inputs/QueueAvgOrderByAggregateInput";
import { QueueCountOrderByAggregateInput } from "../inputs/QueueCountOrderByAggregateInput";
import { QueueMaxOrderByAggregateInput } from "../inputs/QueueMaxOrderByAggregateInput";
import { QueueMinOrderByAggregateInput } from "../inputs/QueueMinOrderByAggregateInput";
import { QueueSumOrderByAggregateInput } from "../inputs/QueueSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("QueueOrderByWithAggregationInput", {
  isAbstract: true
})
export class QueueOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  join_code?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  name?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  address?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  state?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  capacity?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  max_party_size?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  grace_period?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  offline_time?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  create_time?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  password?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  organizer_id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => QueueCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: QueueCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => QueueAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: QueueAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => QueueMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: QueueMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => QueueMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: QueueMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => QueueSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: QueueSumOrderByAggregateInput | undefined;
}
