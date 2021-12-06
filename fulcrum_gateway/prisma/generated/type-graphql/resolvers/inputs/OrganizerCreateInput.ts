import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueCreateNestedManyWithoutOrganizerInput } from "../inputs/QueueCreateNestedManyWithoutOrganizerInput";

@TypeGraphQL.InputType("OrganizerCreateInput", {
  isAbstract: true
})
export class OrganizerCreateInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  password?: string | undefined;

  @TypeGraphQL.Field(_type => QueueCreateNestedManyWithoutOrganizerInput, {
    nullable: true
  })
  queues?: QueueCreateNestedManyWithoutOrganizerInput | undefined;
}
