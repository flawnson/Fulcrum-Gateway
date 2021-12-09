import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Queue } from "../models/Queue";
import { OrganizerCount } from "../resolvers/outputs/OrganizerCount";

@TypeGraphQL.ObjectType("Organizer", {
  isAbstract: true
})
export class Organizer {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  password?: string | null;

  queues?: Queue[];

  @TypeGraphQL.Field(_type => OrganizerCount, {
    nullable: false
  })
  _count!: OrganizerCount;
}
