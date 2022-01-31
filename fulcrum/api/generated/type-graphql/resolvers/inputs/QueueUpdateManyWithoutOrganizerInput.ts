import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueCreateManyOrganizerInputEnvelope } from "../inputs/QueueCreateManyOrganizerInputEnvelope";
import { QueueCreateOrConnectWithoutOrganizerInput } from "../inputs/QueueCreateOrConnectWithoutOrganizerInput";
import { QueueCreateWithoutOrganizerInput } from "../inputs/QueueCreateWithoutOrganizerInput";
import { QueueScalarWhereInput } from "../inputs/QueueScalarWhereInput";
import { QueueUpdateManyWithWhereWithoutOrganizerInput } from "../inputs/QueueUpdateManyWithWhereWithoutOrganizerInput";
import { QueueUpdateWithWhereUniqueWithoutOrganizerInput } from "../inputs/QueueUpdateWithWhereUniqueWithoutOrganizerInput";
import { QueueUpsertWithWhereUniqueWithoutOrganizerInput } from "../inputs/QueueUpsertWithWhereUniqueWithoutOrganizerInput";
import { QueueWhereUniqueInput } from "../inputs/QueueWhereUniqueInput";

@TypeGraphQL.InputType("QueueUpdateManyWithoutOrganizerInput", {
  isAbstract: true
})
export class QueueUpdateManyWithoutOrganizerInput {
  @TypeGraphQL.Field(_type => [QueueCreateWithoutOrganizerInput], {
    nullable: true
  })
  create?: QueueCreateWithoutOrganizerInput[] | undefined;

  @TypeGraphQL.Field(_type => [QueueCreateOrConnectWithoutOrganizerInput], {
    nullable: true
  })
  connectOrCreate?: QueueCreateOrConnectWithoutOrganizerInput[] | undefined;

  @TypeGraphQL.Field(_type => [QueueUpsertWithWhereUniqueWithoutOrganizerInput], {
    nullable: true
  })
  upsert?: QueueUpsertWithWhereUniqueWithoutOrganizerInput[] | undefined;

  @TypeGraphQL.Field(_type => QueueCreateManyOrganizerInputEnvelope, {
    nullable: true
  })
  createMany?: QueueCreateManyOrganizerInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [QueueWhereUniqueInput], {
    nullable: true
  })
  set?: QueueWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [QueueWhereUniqueInput], {
    nullable: true
  })
  disconnect?: QueueWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [QueueWhereUniqueInput], {
    nullable: true
  })
  delete?: QueueWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [QueueWhereUniqueInput], {
    nullable: true
  })
  connect?: QueueWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [QueueUpdateWithWhereUniqueWithoutOrganizerInput], {
    nullable: true
  })
  update?: QueueUpdateWithWhereUniqueWithoutOrganizerInput[] | undefined;

  @TypeGraphQL.Field(_type => [QueueUpdateManyWithWhereWithoutOrganizerInput], {
    nullable: true
  })
  updateMany?: QueueUpdateManyWithWhereWithoutOrganizerInput[] | undefined;

  @TypeGraphQL.Field(_type => [QueueScalarWhereInput], {
    nullable: true
  })
  deleteMany?: QueueScalarWhereInput[] | undefined;
}
