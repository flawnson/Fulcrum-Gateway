import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { OrganizerCountOrderByAggregateInput } from "../inputs/OrganizerCountOrderByAggregateInput";
import { OrganizerMaxOrderByAggregateInput } from "../inputs/OrganizerMaxOrderByAggregateInput";
import { OrganizerMinOrderByAggregateInput } from "../inputs/OrganizerMinOrderByAggregateInput";
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
  email?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  password?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  confirmed?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => OrganizerCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: OrganizerCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => OrganizerMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: OrganizerMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => OrganizerMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: OrganizerMinOrderByAggregateInput | undefined;
}
