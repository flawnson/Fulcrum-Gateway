import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { OrganizerOrderByWithAggregationInput } from "../../../inputs/OrganizerOrderByWithAggregationInput";
import { OrganizerScalarWhereWithAggregatesInput } from "../../../inputs/OrganizerScalarWhereWithAggregatesInput";
import { OrganizerWhereInput } from "../../../inputs/OrganizerWhereInput";
import { OrganizerScalarFieldEnum } from "../../../../enums/OrganizerScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByOrganizerArgs {
  @TypeGraphQL.Field(_type => OrganizerWhereInput, {
    nullable: true
  })
  where?: OrganizerWhereInput | undefined;

  @TypeGraphQL.Field(_type => [OrganizerOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: OrganizerOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [OrganizerScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "name">;

  @TypeGraphQL.Field(_type => OrganizerScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: OrganizerScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
