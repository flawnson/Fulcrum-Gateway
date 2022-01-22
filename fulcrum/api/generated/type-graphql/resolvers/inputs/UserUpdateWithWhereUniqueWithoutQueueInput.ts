import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserUpdateWithoutQueueInput } from "../inputs/UserUpdateWithoutQueueInput";
import { UserWhereUniqueInput } from "../inputs/UserWhereUniqueInput";

@TypeGraphQL.InputType("UserUpdateWithWhereUniqueWithoutQueueInput", {
  isAbstract: true
})
export class UserUpdateWithWhereUniqueWithoutQueueInput {
  @TypeGraphQL.Field(_type => UserWhereUniqueInput, {
    nullable: false
  })
  where!: UserWhereUniqueInput;

  @TypeGraphQL.Field(_type => UserUpdateWithoutQueueInput, {
    nullable: false
  })
  data!: UserUpdateWithoutQueueInput;
}
