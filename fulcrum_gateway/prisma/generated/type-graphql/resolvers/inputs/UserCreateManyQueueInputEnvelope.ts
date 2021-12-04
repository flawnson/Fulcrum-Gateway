import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserCreateManyQueueInput } from "../inputs/UserCreateManyQueueInput";

@TypeGraphQL.InputType("UserCreateManyQueueInputEnvelope", {
  isAbstract: true
})
export class UserCreateManyQueueInputEnvelope {
  @TypeGraphQL.Field(_type => [UserCreateManyQueueInput], {
    nullable: false
  })
  data!: UserCreateManyQueueInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
