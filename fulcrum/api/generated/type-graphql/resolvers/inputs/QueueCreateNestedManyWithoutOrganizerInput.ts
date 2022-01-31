import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueCreateManyOrganizerInputEnvelope } from "../inputs/QueueCreateManyOrganizerInputEnvelope";
import { QueueCreateOrConnectWithoutOrganizerInput } from "../inputs/QueueCreateOrConnectWithoutOrganizerInput";
import { QueueCreateWithoutOrganizerInput } from "../inputs/QueueCreateWithoutOrganizerInput";
import { QueueWhereUniqueInput } from "../inputs/QueueWhereUniqueInput";

@TypeGraphQL.InputType("QueueCreateNestedManyWithoutOrganizerInput", {
  isAbstract: true
})
export class QueueCreateNestedManyWithoutOrganizerInput {
  @TypeGraphQL.Field(_type => [QueueCreateWithoutOrganizerInput], {
    nullable: true
  })
  create?: QueueCreateWithoutOrganizerInput[] | undefined;

  @TypeGraphQL.Field(_type => [QueueCreateOrConnectWithoutOrganizerInput], {
    nullable: true
  })
  connectOrCreate?: QueueCreateOrConnectWithoutOrganizerInput[] | undefined;

  @TypeGraphQL.Field(_type => QueueCreateManyOrganizerInputEnvelope, {
    nullable: true
  })
  createMany?: QueueCreateManyOrganizerInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [QueueWhereUniqueInput], {
    nullable: true
  })
  connect?: QueueWhereUniqueInput[] | undefined;
}
