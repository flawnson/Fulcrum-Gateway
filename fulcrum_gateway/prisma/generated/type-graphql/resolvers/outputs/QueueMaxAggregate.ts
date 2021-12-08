import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueState } from "../../enums/QueueState";

@TypeGraphQL.ObjectType("QueueMaxAggregate", {
  isAbstract: true
})
export class QueueMaxAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  organizer_id!: number | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  join_code!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  name!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  address!: string | null;

  @TypeGraphQL.Field(_type => QueueState, {
    nullable: true
  })
  state!: "ACTIVE" | "PAUSED" | "INACTIVE" | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  capacity!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  max_party_size!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  grace_period!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  offline_time!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  create_time!: Date | null;
}