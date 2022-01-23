import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { OrganizerWhereInput } from "../inputs/OrganizerWhereInput";

@TypeGraphQL.InputType("OrganizerRelationFilter", {
  isAbstract: true
})
export class OrganizerRelationFilter {
  @TypeGraphQL.Field(_type => OrganizerWhereInput, {
    nullable: true
  })
  is?: OrganizerWhereInput | undefined;

  @TypeGraphQL.Field(_type => OrganizerWhereInput, {
    nullable: true
  })
  isNot?: OrganizerWhereInput | undefined;
}
