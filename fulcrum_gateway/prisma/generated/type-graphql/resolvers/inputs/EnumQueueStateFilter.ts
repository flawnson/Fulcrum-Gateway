import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumQueueStateFilter } from "../inputs/NestedEnumQueueStateFilter";
import { QueueState } from "../../enums/QueueState";

@TypeGraphQL.InputType("EnumQueueStateFilter", {
  isAbstract: true
})
export class EnumQueueStateFilter {
  @TypeGraphQL.Field(_type => QueueState, {
    nullable: true
  })
  equals?: "ACTIVE" | "PAUSED" | "INACTIVE" | undefined;

  @TypeGraphQL.Field(_type => [QueueState], {
    nullable: true
  })
  in?: Array<"ACTIVE" | "PAUSED" | "INACTIVE"> | undefined;

  @TypeGraphQL.Field(_type => [QueueState], {
    nullable: true
  })
  notIn?: Array<"ACTIVE" | "PAUSED" | "INACTIVE"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumQueueStateFilter, {
    nullable: true
  })
  not?: NestedEnumQueueStateFilter | undefined;
}