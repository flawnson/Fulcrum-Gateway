import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueCreateWithoutOrganizerInput } from "../inputs/QueueCreateWithoutOrganizerInput";
import { QueueUpdateWithoutOrganizerInput } from "../inputs/QueueUpdateWithoutOrganizerInput";
import { QueueWhereUniqueInput } from "../inputs/QueueWhereUniqueInput";

@TypeGraphQL.InputType("QueueUpsertWithWhereUniqueWithoutOrganizerInput", {
  isAbstract: true
})
export class QueueUpsertWithWhereUniqueWithoutOrganizerInput {
  @TypeGraphQL.Field(_type => QueueWhereUniqueInput, {
    nullable: false
  })
  where!: QueueWhereUniqueInput;

  @TypeGraphQL.Field(_type => QueueUpdateWithoutOrganizerInput, {
    nullable: false
  })
  update!: QueueUpdateWithoutOrganizerInput;

  @TypeGraphQL.Field(_type => QueueCreateWithoutOrganizerInput, {
    nullable: false
  })
  create!: QueueCreateWithoutOrganizerInput;
}
