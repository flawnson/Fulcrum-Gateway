import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueScalarWhereInput } from "../inputs/QueueScalarWhereInput";
import { QueueUpdateManyMutationInput } from "../inputs/QueueUpdateManyMutationInput";

@TypeGraphQL.InputType("QueueUpdateManyWithWhereWithoutOrganizerInput", {
  isAbstract: true
})
export class QueueUpdateManyWithWhereWithoutOrganizerInput {
  @TypeGraphQL.Field(_type => QueueScalarWhereInput, {
    nullable: false
  })
  where!: QueueScalarWhereInput;

  @TypeGraphQL.Field(_type => QueueUpdateManyMutationInput, {
    nullable: false
  })
  data!: QueueUpdateManyMutationInput;
}
