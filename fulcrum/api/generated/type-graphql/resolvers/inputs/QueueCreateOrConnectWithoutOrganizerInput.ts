import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueCreateWithoutOrganizerInput } from "../inputs/QueueCreateWithoutOrganizerInput";
import { QueueWhereUniqueInput } from "../inputs/QueueWhereUniqueInput";

@TypeGraphQL.InputType("QueueCreateOrConnectWithoutOrganizerInput", {
  isAbstract: true
})
export class QueueCreateOrConnectWithoutOrganizerInput {
  @TypeGraphQL.Field(_type => QueueWhereUniqueInput, {
    nullable: false
  })
  where!: QueueWhereUniqueInput;

  @TypeGraphQL.Field(_type => QueueCreateWithoutOrganizerInput, {
    nullable: false
  })
  create!: QueueCreateWithoutOrganizerInput;
}
