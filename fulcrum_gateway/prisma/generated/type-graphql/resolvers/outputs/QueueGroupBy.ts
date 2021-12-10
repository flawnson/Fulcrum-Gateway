import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueAvgAggregate } from "../outputs/QueueAvgAggregate";
import { QueueCountAggregate } from "../outputs/QueueCountAggregate";
import { QueueMaxAggregate } from "../outputs/QueueMaxAggregate";
import { QueueMinAggregate } from "../outputs/QueueMinAggregate";
import { QueueSumAggregate } from "../outputs/QueueSumAggregate";
import { QueueState } from "../../enums/QueueState";

@TypeGraphQL.ObjectType("QueueGroupBy", {
  isAbstract: true
})
export class QueueGroupBy {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  id!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  organizer_id!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  join_code!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  address!: string;

  @TypeGraphQL.Field(_type => QueueState, {
    nullable: false
  })
  state!: "ACTIVE" | "PAUSED" | "INACTIVE";

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  capacity!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  max_party_size!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  grace_period!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  offline_time!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  create_time!: Date;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  average_wait!: number;

  @TypeGraphQL.Field(_type => QueueCountAggregate, {
    nullable: true
  })
  _count!: QueueCountAggregate | null;

  @TypeGraphQL.Field(_type => QueueAvgAggregate, {
    nullable: true
  })
  _avg!: QueueAvgAggregate | null;

  @TypeGraphQL.Field(_type => QueueSumAggregate, {
    nullable: true
  })
  _sum!: QueueSumAggregate | null;

  @TypeGraphQL.Field(_type => QueueMinAggregate, {
    nullable: true
  })
  _min!: QueueMinAggregate | null;

  @TypeGraphQL.Field(_type => QueueMaxAggregate, {
    nullable: true
  })
  _max!: QueueMaxAggregate | null;
}
