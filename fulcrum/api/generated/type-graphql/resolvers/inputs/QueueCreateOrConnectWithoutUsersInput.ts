import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueCreateWithoutUsersInput } from "../inputs/QueueCreateWithoutUsersInput";
import { QueueWhereUniqueInput } from "../inputs/QueueWhereUniqueInput";

@TypeGraphQL.InputType("QueueCreateOrConnectWithoutUsersInput", {
  isAbstract: true
})
export class QueueCreateOrConnectWithoutUsersInput {
  @TypeGraphQL.Field(_type => QueueWhereUniqueInput, {
    nullable: false
  })
  where!: QueueWhereUniqueInput;

  @TypeGraphQL.Field(_type => QueueCreateWithoutUsersInput, {
    nullable: false
  })
  create!: QueueCreateWithoutUsersInput;
}
