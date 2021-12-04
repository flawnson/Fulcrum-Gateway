import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { OrganizerAvgOrderByAggregateInput } from "../inputs/OrganizerAvgOrderByAggregateInput";
import { OrganizerCountOrderByAggregateInput } from "../inputs/OrganizerCountOrderByAggregateInput";
import { OrganizerMaxOrderByAggregateInput } from "../inputs/OrganizerMaxOrderByAggregateInput";
import { OrganizerMinOrderByAggregateInput } from "../inputs/OrganizerMinOrderByAggregateInput";
import { OrganizerSumOrderByAggregateInput } from "../inputs/OrganizerSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("OrganizerOrderByWithAggregationInput", {
  isAbstract: true
})
export class OrganizerOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  name?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  password?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => OrganizerCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: OrganizerCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => OrganizerAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: OrganizerAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => OrganizerMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: OrganizerMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => OrganizerMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: OrganizerMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => OrganizerSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: OrganizerSumOrderByAggregateInput | undefined;
}
