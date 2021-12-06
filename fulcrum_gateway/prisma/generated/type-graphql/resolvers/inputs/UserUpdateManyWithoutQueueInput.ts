import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserCreateManyQueueInputEnvelope } from "../inputs/UserCreateManyQueueInputEnvelope";
import { UserCreateOrConnectWithoutQueueInput } from "../inputs/UserCreateOrConnectWithoutQueueInput";
import { UserCreateWithoutQueueInput } from "../inputs/UserCreateWithoutQueueInput";
import { UserScalarWhereInput } from "../inputs/UserScalarWhereInput";
import { UserUpdateManyWithWhereWithoutQueueInput } from "../inputs/UserUpdateManyWithWhereWithoutQueueInput";
import { UserUpdateWithWhereUniqueWithoutQueueInput } from "../inputs/UserUpdateWithWhereUniqueWithoutQueueInput";
import { UserUpsertWithWhereUniqueWithoutQueueInput } from "../inputs/UserUpsertWithWhereUniqueWithoutQueueInput";
import { UserWhereUniqueInput } from "../inputs/UserWhereUniqueInput";

@TypeGraphQL.InputType("UserUpdateManyWithoutQueueInput", {
  isAbstract: true
})
export class UserUpdateManyWithoutQueueInput {
  @TypeGraphQL.Field(_type => [UserCreateWithoutQueueInput], {
    nullable: true
  })
  create?: UserCreateWithoutQueueInput[] | undefined;

  @TypeGraphQL.Field(_type => [UserCreateOrConnectWithoutQueueInput], {
    nullable: true
  })
  connectOrCreate?: UserCreateOrConnectWithoutQueueInput[] | undefined;

  @TypeGraphQL.Field(_type => [UserUpsertWithWhereUniqueWithoutQueueInput], {
    nullable: true
  })
  upsert?: UserUpsertWithWhereUniqueWithoutQueueInput[] | undefined;

  @TypeGraphQL.Field(_type => UserCreateManyQueueInputEnvelope, {
    nullable: true
  })
  createMany?: UserCreateManyQueueInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [UserWhereUniqueInput], {
    nullable: true
  })
  set?: UserWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [UserWhereUniqueInput], {
    nullable: true
  })
  disconnect?: UserWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [UserWhereUniqueInput], {
    nullable: true
  })
  delete?: UserWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [UserWhereUniqueInput], {
    nullable: true
  })
  connect?: UserWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [UserUpdateWithWhereUniqueWithoutQueueInput], {
    nullable: true
  })
  update?: UserUpdateWithWhereUniqueWithoutQueueInput[] | undefined;

  @TypeGraphQL.Field(_type => [UserUpdateManyWithWhereWithoutQueueInput], {
    nullable: true
  })
  updateMany?: UserUpdateManyWithWhereWithoutQueueInput[] | undefined;

  @TypeGraphQL.Field(_type => [UserScalarWhereInput], {
    nullable: true
  })
  deleteMany?: UserScalarWhereInput[] | undefined;
}
