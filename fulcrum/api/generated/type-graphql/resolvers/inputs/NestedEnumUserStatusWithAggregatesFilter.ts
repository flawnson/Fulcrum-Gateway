import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumUserStatusFilter } from "../inputs/NestedEnumUserStatusFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { UserStatus } from "../../enums/UserStatus";

@TypeGraphQL.InputType("NestedEnumUserStatusWithAggregatesFilter", {
  isAbstract: true
})
export class NestedEnumUserStatusWithAggregatesFilter {
  @TypeGraphQL.Field(_type => UserStatus, {
    nullable: true
  })
  equals?: "UNVERIFIED" | "KICKED" | "ENQUEUED" | "SERVICED" | "DEFERRED" | "ABANDONED" | "NOSHOW" | undefined;

  @TypeGraphQL.Field(_type => [UserStatus], {
    nullable: true
  })
  in?: Array<"UNVERIFIED" | "KICKED" | "ENQUEUED" | "SERVICED" | "DEFERRED" | "ABANDONED" | "NOSHOW"> | undefined;

  @TypeGraphQL.Field(_type => [UserStatus], {
    nullable: true
  })
  notIn?: Array<"UNVERIFIED" | "KICKED" | "ENQUEUED" | "SERVICED" | "DEFERRED" | "ABANDONED" | "NOSHOW"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumUserStatusWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumUserStatusWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumUserStatusFilter, {
    nullable: true
  })
  _min?: NestedEnumUserStatusFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumUserStatusFilter, {
    nullable: true
  })
  _max?: NestedEnumUserStatusFilter | undefined;
}
