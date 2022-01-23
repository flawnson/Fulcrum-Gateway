import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueUpdateWithoutOrganizerInput } from "../inputs/QueueUpdateWithoutOrganizerInput";
import { QueueWhereUniqueInput } from "../inputs/QueueWhereUniqueInput";

@TypeGraphQL.InputType("QueueUpdateWithWhereUniqueWithoutOrganizerInput", {
  isAbstract: true
})
export class QueueUpdateWithWhereUniqueWithoutOrganizerInput {
  @TypeGraphQL.Field(_type => QueueWhereUniqueInput, {
    nullable: false
  })
  where!: QueueWhereUniqueInput;

  @TypeGraphQL.Field(_type => QueueUpdateWithoutOrganizerInput, {
    nullable: false
  })
  data!: QueueUpdateWithoutOrganizerInput;
}
