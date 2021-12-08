import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserStatus } from "../../enums/UserStatus";

@TypeGraphQL.ObjectType("UserMaxAggregate", {
  isAbstract: true
})
export class UserMaxAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id!: number | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  name!: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  queue_id!: number | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  summoned!: boolean | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  password!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  phone_number!: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  party_size!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  last_online!: Date | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  index!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  estimated_wait!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  join_time!: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  reneged_time!: Date | null;

  @TypeGraphQL.Field(_type => UserStatus, {
    nullable: true
  })
  state!: "KICKED" | "ENQUEUED" | "SERVICED" | "DEFERRED" | "ABANDONED" | "NOSHOW" | null;
}
