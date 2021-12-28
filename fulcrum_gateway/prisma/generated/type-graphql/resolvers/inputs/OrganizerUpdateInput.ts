import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueUpdateManyWithoutOrganizerInput } from "../inputs/QueueUpdateManyWithoutOrganizerInput";
import { StringFieldUpdateOperationsInput } from "../inputs/StringFieldUpdateOperationsInput";

@TypeGraphQL.InputType("OrganizerUpdateInput", {
  isAbstract: true
})
export class OrganizerUpdateInput {
  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  id?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  name?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => QueueUpdateManyWithoutOrganizerInput, {
    nullable: true
  })
  queues?: QueueUpdateManyWithoutOrganizerInput | undefined;
}
