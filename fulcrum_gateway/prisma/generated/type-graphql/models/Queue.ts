import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Organizer } from "../models/Organizer";
import { User } from "../models/User";
import { QueueState } from "../enums/QueueState";
import { QueueCount } from "../resolvers/outputs/QueueCount";

@TypeGraphQL.ObjectType("Queue", {
  isAbstract: true
})
export class Queue {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  organizer_id!: number;

  organizer?: Organizer;

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
  grace_period?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  offline_time?: number | null;

  users?: User[];

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  create_time!: Date;

  @TypeGraphQL.Field(_type => QueueCount, {
    nullable: false
  })
  _count!: QueueCount;
}
