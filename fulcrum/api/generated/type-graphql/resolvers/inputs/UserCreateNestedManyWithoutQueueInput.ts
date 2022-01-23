import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserCreateManyQueueInputEnvelope } from "../inputs/UserCreateManyQueueInputEnvelope";
import { UserCreateOrConnectWithoutQueueInput } from "../inputs/UserCreateOrConnectWithoutQueueInput";
import { UserCreateWithoutQueueInput } from "../inputs/UserCreateWithoutQueueInput";
import { UserWhereUniqueInput } from "../inputs/UserWhereUniqueInput";

@TypeGraphQL.InputType("UserCreateNestedManyWithoutQueueInput", {
  isAbstract: true
})
export class UserCreateNestedManyWithoutQueueInput {
  @TypeGraphQL.Field(_type => [UserCreateWithoutQueueInput], {
    nullable: true
  })
  create?: UserCreateWithoutQueueInput[] | undefined;

  @TypeGraphQL.Field(_type => [UserCreateOrConnectWithoutQueueInput], {
    nullable: true
  })
  connectOrCreate?: UserCreateOrConnectWithoutQueueInput[] | undefined;

  @TypeGraphQL.Field(_type => UserCreateManyQueueInputEnvelope, {
    nullable: true
  })
  createMany?: UserCreateManyQueueInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [UserWhereUniqueInput], {
    nullable: true
  })
  connect?: UserWhereUniqueInput[] | undefined;
}
