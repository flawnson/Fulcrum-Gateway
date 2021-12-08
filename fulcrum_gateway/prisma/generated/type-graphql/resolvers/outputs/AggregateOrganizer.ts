import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { OrganizerAvgAggregate } from "../outputs/OrganizerAvgAggregate";
import { OrganizerCountAggregate } from "../outputs/OrganizerCountAggregate";
import { OrganizerMaxAggregate } from "../outputs/OrganizerMaxAggregate";
import { OrganizerMinAggregate } from "../outputs/OrganizerMinAggregate";
import { OrganizerSumAggregate } from "../outputs/OrganizerSumAggregate";

@TypeGraphQL.ObjectType("AggregateOrganizer", {
  isAbstract: true
})
export class AggregateOrganizer {
  @TypeGraphQL.Field(_type => OrganizerCountAggregate, {
    nullable: true
  })
  _count!: OrganizerCountAggregate | null;

  @TypeGraphQL.Field(_type => OrganizerAvgAggregate, {
    nullable: true
  })
  _avg!: OrganizerAvgAggregate | null;

  @TypeGraphQL.Field(_type => OrganizerSumAggregate, {
    nullable: true
  })
  _sum!: OrganizerSumAggregate | null;

  @TypeGraphQL.Field(_type => OrganizerMinAggregate, {
    nullable: true
  })
  _min!: OrganizerMinAggregate | null;

  @TypeGraphQL.Field(_type => OrganizerMaxAggregate, {
    nullable: true
  })
  _max!: OrganizerMaxAggregate | null;
}