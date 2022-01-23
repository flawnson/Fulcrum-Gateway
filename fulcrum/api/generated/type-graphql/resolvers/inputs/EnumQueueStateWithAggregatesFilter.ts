import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumQueueStateFilter } from "../inputs/NestedEnumQueueStateFilter";
import { NestedEnumQueueStateWithAggregatesFilter } from "../inputs/NestedEnumQueueStateWithAggregatesFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { QueueState } from "../../enums/QueueState";

@TypeGraphQL.InputType("EnumQueueStateWithAggregatesFilter", {
  isAbstract: true
})
export class EnumQueueStateWithAggregatesFilter {
  @TypeGraphQL.Field(_type => QueueState, {
    nullable: true
  })
  equals?: "ACTIVE" | "PAUSED" | undefined;

  @TypeGraphQL.Field(_type => [QueueState], {
    nullable: true
  })
  in?: Array<"ACTIVE" | "PAUSED"> | undefined;

  @TypeGraphQL.Field(_type => [QueueState], {
    nullable: true
  })
  notIn?: Array<"ACTIVE" | "PAUSED"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumQueueStateWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumQueueStateWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumQueueStateFilter, {
    nullable: true
  })
  _min?: NestedEnumQueueStateFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumQueueStateFilter, {
    nullable: true
  })
  _max?: NestedEnumQueueStateFilter | undefined;
}
