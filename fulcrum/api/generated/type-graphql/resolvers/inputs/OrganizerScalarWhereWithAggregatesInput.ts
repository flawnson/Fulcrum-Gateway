import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolWithAggregatesFilter } from "../inputs/BoolWithAggregatesFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType("OrganizerScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class OrganizerScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [OrganizerScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: OrganizerScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [OrganizerScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: OrganizerScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [OrganizerScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: OrganizerScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  id?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  name?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  email?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  password?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => BoolWithAggregatesFilter, {
    nullable: true
  })
  confirmed?: BoolWithAggregatesFilter | undefined;
}
