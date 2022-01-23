import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { OrganizerCreateWithoutQueuesInput } from "../inputs/OrganizerCreateWithoutQueuesInput";
import { OrganizerUpdateWithoutQueuesInput } from "../inputs/OrganizerUpdateWithoutQueuesInput";

@TypeGraphQL.InputType("OrganizerUpsertWithoutQueuesInput", {
  isAbstract: true
})
export class OrganizerUpsertWithoutQueuesInput {
  @TypeGraphQL.Field(_type => OrganizerUpdateWithoutQueuesInput, {
    nullable: false
  })
  update!: OrganizerUpdateWithoutQueuesInput;

  @TypeGraphQL.Field(_type => OrganizerCreateWithoutQueuesInput, {
    nullable: false
  })
  create!: OrganizerCreateWithoutQueuesInput;
}
