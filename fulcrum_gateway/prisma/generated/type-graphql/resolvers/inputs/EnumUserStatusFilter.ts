import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumUserStatusFilter } from "../inputs/NestedEnumUserStatusFilter";
import { UserStatus } from "../../enums/UserStatus";

@TypeGraphQL.InputType("EnumUserStatusFilter", {
  isAbstract: true
})
export class EnumUserStatusFilter {
  @TypeGraphQL.Field(_type => UserStatus, {
    nullable: true
  })
  equals?: "ENQUEUED" | "SERVICED" | "DEFERRED" | "ABANDONED" | "NOSHOW" | undefined;

  @TypeGraphQL.Field(_type => [UserStatus], {
    nullable: true
  })
  in?: Array<"ENQUEUED" | "SERVICED" | "DEFERRED" | "ABANDONED" | "NOSHOW"> | undefined;

  @TypeGraphQL.Field(_type => [UserStatus], {
    nullable: true
  })
  notIn?: Array<"ENQUEUED" | "SERVICED" | "DEFERRED" | "ABANDONED" | "NOSHOW"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumUserStatusFilter, {
    nullable: true
  })
  not?: NestedEnumUserStatusFilter | undefined;
}
