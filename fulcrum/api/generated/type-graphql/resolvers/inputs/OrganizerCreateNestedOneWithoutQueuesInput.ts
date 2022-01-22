import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { OrganizerCreateOrConnectWithoutQueuesInput } from "../inputs/OrganizerCreateOrConnectWithoutQueuesInput";
import { OrganizerCreateWithoutQueuesInput } from "../inputs/OrganizerCreateWithoutQueuesInput";
import { OrganizerWhereUniqueInput } from "../inputs/OrganizerWhereUniqueInput";

@TypeGraphQL.InputType("OrganizerCreateNestedOneWithoutQueuesInput", {
  isAbstract: true
})
export class OrganizerCreateNestedOneWithoutQueuesInput {
  @TypeGraphQL.Field(_type => OrganizerCreateWithoutQueuesInput, {
    nullable: true
  })
  create?: OrganizerCreateWithoutQueuesInput | undefined;

  @TypeGraphQL.Field(_type => OrganizerCreateOrConnectWithoutQueuesInput, {
    nullable: true
  })
  connectOrCreate?: OrganizerCreateOrConnectWithoutQueuesInput | undefined;

  @TypeGraphQL.Field(_type => OrganizerWhereUniqueInput, {
    nullable: true
  })
  connect?: OrganizerWhereUniqueInput | undefined;
}
