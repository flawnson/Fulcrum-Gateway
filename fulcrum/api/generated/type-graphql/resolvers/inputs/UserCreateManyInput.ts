import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserStatus } from "../../enums/UserStatus";

@TypeGraphQL.InputType("UserCreateManyInput", {
  isAbstract: true
})
export class UserCreateManyInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  id?: string | undefined;

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
  phone_number?: string | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  party_size?: number | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  last_online?: Date | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  index?: number | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  join_time?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  finish_time?: Date | undefined;

  @TypeGraphQL.Field(_type => UserStatus, {
    nullable: true
  })
  status?: "UNVERIFIED" | "KICKED" | "ENQUEUED" | "SERVICED" | "DEFERRED" | "ABANDONED" | "NOSHOW" | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  summoned_time?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  queue_id!: string;
}
