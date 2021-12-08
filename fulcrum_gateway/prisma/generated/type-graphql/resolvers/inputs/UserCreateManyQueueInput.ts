import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserStatus } from "../../enums/UserStatus";

@TypeGraphQL.InputType("UserCreateManyQueueInput", {
  isAbstract: true
})
export class UserCreateManyQueueInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id?: number | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  summoned?: boolean | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  password?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  phone_number!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  party_size?: number | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  last_online?: Date | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  index!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  estimated_wait!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  join_time?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  reneged_time?: Date | undefined;

  @TypeGraphQL.Field(_type => UserStatus, {
    nullable: false
  })
  state!: "KICKED" | "ENQUEUED" | "SERVICED" | "DEFERRED" | "ABANDONED" | "NOSHOW";
}
