import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { OrganizerCreateOrConnectWithoutQueuesInput } from "../inputs/OrganizerCreateOrConnectWithoutQueuesInput";
import { OrganizerCreateWithoutQueuesInput } from "../inputs/OrganizerCreateWithoutQueuesInput";
import { OrganizerUpdateWithoutQueuesInput } from "../inputs/OrganizerUpdateWithoutQueuesInput";
import { OrganizerUpsertWithoutQueuesInput } from "../inputs/OrganizerUpsertWithoutQueuesInput";
import { OrganizerWhereUniqueInput } from "../inputs/OrganizerWhereUniqueInput";

@TypeGraphQL.InputType("OrganizerUpdateOneRequiredWithoutQueuesInput", {
  isAbstract: true
})
export class OrganizerUpdateOneRequiredWithoutQueuesInput {
  @TypeGraphQL.Field(_type => OrganizerCreateWithoutQueuesInput, {
    nullable: true
  })
  create?: OrganizerCreateWithoutQueuesInput | undefined;

  @TypeGraphQL.Field(_type => OrganizerCreateOrConnectWithoutQueuesInput, {
    nullable: true
  })
  connectOrCreate?: OrganizerCreateOrConnectWithoutQueuesInput | undefined;

  @TypeGraphQL.Field(_type => OrganizerUpsertWithoutQueuesInput, {
    nullable: true
  })
  upsert?: OrganizerUpsertWithoutQueuesInput | undefined;

  @TypeGraphQL.Field(_type => OrganizerWhereUniqueInput, {
    nullable: true
  })
  connect?: OrganizerWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => OrganizerUpdateWithoutQueuesInput, {
    nullable: true
  })
  update?: OrganizerUpdateWithoutQueuesInput | undefined;
}
