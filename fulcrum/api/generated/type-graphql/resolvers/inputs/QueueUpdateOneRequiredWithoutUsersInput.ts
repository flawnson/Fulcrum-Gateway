import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueCreateOrConnectWithoutUsersInput } from "../inputs/QueueCreateOrConnectWithoutUsersInput";
import { QueueCreateWithoutUsersInput } from "../inputs/QueueCreateWithoutUsersInput";
import { QueueUpdateWithoutUsersInput } from "../inputs/QueueUpdateWithoutUsersInput";
import { QueueUpsertWithoutUsersInput } from "../inputs/QueueUpsertWithoutUsersInput";
import { QueueWhereUniqueInput } from "../inputs/QueueWhereUniqueInput";

@TypeGraphQL.InputType("QueueUpdateOneRequiredWithoutUsersInput", {
  isAbstract: true
})
export class QueueUpdateOneRequiredWithoutUsersInput {
  @TypeGraphQL.Field(_type => QueueCreateWithoutUsersInput, {
    nullable: true
  })
  create?: QueueCreateWithoutUsersInput | undefined;

  @TypeGraphQL.Field(_type => QueueCreateOrConnectWithoutUsersInput, {
    nullable: true
  })
  connectOrCreate?: QueueCreateOrConnectWithoutUsersInput | undefined;

  @TypeGraphQL.Field(_type => QueueUpsertWithoutUsersInput, {
    nullable: true
  })
  upsert?: QueueUpsertWithoutUsersInput | undefined;

  @TypeGraphQL.Field(_type => QueueWhereUniqueInput, {
    nullable: true
  })
  connect?: QueueWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => QueueUpdateWithoutUsersInput, {
    nullable: true
  })
  update?: QueueUpdateWithoutUsersInput | undefined;
}
