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
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  id!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  queues?: Queue[];

  @TypeGraphQL.Field(_type => OrganizerCount, {
    nullable: true
  })
  _count?: OrganizerCount | null;
}
