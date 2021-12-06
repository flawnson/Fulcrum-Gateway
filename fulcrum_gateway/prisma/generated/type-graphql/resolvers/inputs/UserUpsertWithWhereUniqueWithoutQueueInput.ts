import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserCreateWithoutQueueInput } from "../inputs/UserCreateWithoutQueueInput";
import { UserUpdateWithoutQueueInput } from "../inputs/UserUpdateWithoutQueueInput";
import { UserWhereUniqueInput } from "../inputs/UserWhereUniqueInput";

@TypeGraphQL.InputType("UserUpsertWithWhereUniqueWithoutQueueInput", {
  isAbstract: true
})
export class UserUpsertWithWhereUniqueWithoutQueueInput {
  @TypeGraphQL.Field(_type => UserWhereUniqueInput, {
    nullable: false
  })
  where!: UserWhereUniqueInput;

  @TypeGraphQL.Field(_type => UserUpdateWithoutQueueInput, {
    nullable: false
  })
  update!: UserUpdateWithoutQueueInput;

  @TypeGraphQL.Field(_type => UserCreateWithoutQueueInput, {
    nullable: false
  })
  create!: UserCreateWithoutQueueInput;
}
