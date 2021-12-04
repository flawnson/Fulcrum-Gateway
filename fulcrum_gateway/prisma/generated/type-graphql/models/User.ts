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
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  queue_id!: number;

  queue?: Queue;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  summoned!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  password?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  phone_number!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  party_size!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  last_online!: Date;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  index!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  estimated_wait!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  join_time!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  reneged_time!: Date;

  @TypeGraphQL.Field(_type => UserStatus, {
    nullable: false
  })
  state!: "ENQUEUED" | "SERVICED" | "DEFERRED" | "ABANDONED" | "NOSHOW";
}
