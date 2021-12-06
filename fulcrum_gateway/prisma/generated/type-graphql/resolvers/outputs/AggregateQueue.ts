import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueAvgAggregate } from "../outputs/QueueAvgAggregate";
import { QueueCountAggregate } from "../outputs/QueueCountAggregate";
import { QueueMaxAggregate } from "../outputs/QueueMaxAggregate";
import { QueueMinAggregate } from "../outputs/QueueMinAggregate";
import { QueueSumAggregate } from "../outputs/QueueSumAggregate";

@TypeGraphQL.ObjectType("AggregateQueue", {
  isAbstract: true
})
export class AggregateQueue {
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
