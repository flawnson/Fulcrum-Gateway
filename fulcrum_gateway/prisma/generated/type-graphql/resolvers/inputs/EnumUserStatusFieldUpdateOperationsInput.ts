import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserStatus } from "../../enums/UserStatus";

@TypeGraphQL.InputType("EnumUserStatusFieldUpdateOperationsInput", {
  isAbstract: true
})
export class EnumUserStatusFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => UserStatus, {
    nullable: true
  })
  set?: "ENQUEUED" | "SERVICED" | "DEFERRED" | "ABANDONED" | "NOSHOW" | undefined;
}
