import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserStatus } from "../../enums/UserStatus";

@TypeGraphQL.ObjectType("UserMaxAggregate", {
  isAbstract: true
})
export class UserMaxAggregate {
  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  id!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  name!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  summoned!: boolean | null;

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

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  join_time!: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  reneged_time!: Date | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  total_wait!: number | null;

  @TypeGraphQL.Field(_type => UserStatus, {
    nullable: true
  })
  status!: "UNVERIFIED" | "KICKED" | "ENQUEUED" | "SERVICED" | "DEFERRED" | "ABANDONED" | "NOSHOW" | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  summoned_time!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  queue_id!: string | null;
}
