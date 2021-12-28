import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueListRelationFilter } from "../inputs/QueueListRelationFilter";
import { StringFilter } from "../inputs/StringFilter";

@TypeGraphQL.InputType("OrganizerWhereInput", {
  isAbstract: true
})
export class OrganizerWhereInput {
  @TypeGraphQL.Field(_type => [OrganizerWhereInput], {
    nullable: true
  })
  AND?: OrganizerWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [OrganizerWhereInput], {
    nullable: true
  })
  OR?: OrganizerWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [OrganizerWhereInput], {
    nullable: true
  })
  NOT?: OrganizerWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  id?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  name?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => QueueListRelationFilter, {
    nullable: true
  })
  queues?: QueueListRelationFilter | undefined;
}
