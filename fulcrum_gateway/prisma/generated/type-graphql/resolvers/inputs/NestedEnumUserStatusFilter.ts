import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserStatus } from "../../enums/UserStatus";

@TypeGraphQL.InputType("NestedEnumUserStatusFilter", {
  isAbstract: true
})
export class NestedEnumUserStatusFilter {
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

  @TypeGraphQL.Field(_type => NestedEnumUserStatusFilter, {
    nullable: true
  })
  not?: NestedEnumUserStatusFilter | undefined;
}
