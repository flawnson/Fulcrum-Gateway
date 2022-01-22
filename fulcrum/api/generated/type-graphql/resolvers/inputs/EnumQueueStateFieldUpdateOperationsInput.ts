import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueState } from "../../enums/QueueState";

@TypeGraphQL.InputType("EnumQueueStateFieldUpdateOperationsInput", {
  isAbstract: true
})
export class EnumQueueStateFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => QueueState, {
    nullable: true
  })
  set?: "ACTIVE" | "PAUSED" | "INACTIVE" | undefined;
}
