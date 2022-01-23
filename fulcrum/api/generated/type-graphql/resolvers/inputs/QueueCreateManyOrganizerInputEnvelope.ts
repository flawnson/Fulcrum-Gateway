import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueCreateManyOrganizerInput } from "../inputs/QueueCreateManyOrganizerInput";

@TypeGraphQL.InputType("QueueCreateManyOrganizerInputEnvelope", {
  isAbstract: true
})
export class QueueCreateManyOrganizerInputEnvelope {
  @TypeGraphQL.Field(_type => [QueueCreateManyOrganizerInput], {
    nullable: false
  })
  data!: QueueCreateManyOrganizerInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
