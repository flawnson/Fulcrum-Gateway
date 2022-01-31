import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueCreateWithoutUsersInput } from "../inputs/QueueCreateWithoutUsersInput";
import { QueueUpdateWithoutUsersInput } from "../inputs/QueueUpdateWithoutUsersInput";

@TypeGraphQL.InputType("QueueUpsertWithoutUsersInput", {
  isAbstract: true
})
export class QueueUpsertWithoutUsersInput {
  @TypeGraphQL.Field(_type => QueueUpdateWithoutUsersInput, {
    nullable: false
  })
  update!: QueueUpdateWithoutUsersInput;

  @TypeGraphQL.Field(_type => QueueCreateWithoutUsersInput, {
    nullable: false
  })
  create!: QueueCreateWithoutUsersInput;
}
