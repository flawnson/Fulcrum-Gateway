import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Queue } from "../models/Queue";
import { UserStatus } from "../enums/UserStatus";

@TypeGraphQL.ObjectType("User", {
  isAbstract: true
})
export class User {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  id!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  summoned!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  phone_number!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  party_size!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  last_online?: Date | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  index!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  join_time!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  reneged_time?: Date | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  total_wait?: number | null;

  status?: "UNVERIFIED" | "KICKED" | "ENQUEUED" | "SERVICED" | "DEFERRED" | "ABANDONED" | "NOSHOW";

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  summoned_time?: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  queue_id!: string;

  queue?: Queue;
}
