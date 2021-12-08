import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { OrganizerCreateWithoutQueuesInput } from "../inputs/OrganizerCreateWithoutQueuesInput";
import { OrganizerWhereUniqueInput } from "../inputs/OrganizerWhereUniqueInput";

@TypeGraphQL.InputType("OrganizerCreateOrConnectWithoutQueuesInput", {
  isAbstract: true
})
export class OrganizerCreateOrConnectWithoutQueuesInput {
  @TypeGraphQL.Field(_type => OrganizerWhereUniqueInput, {
    nullable: false
  })
  where!: OrganizerWhereUniqueInput;

  @TypeGraphQL.Field(_type => OrganizerCreateWithoutQueuesInput, {
    nullable: false
  })
  create!: OrganizerCreateWithoutQueuesInput;
}
