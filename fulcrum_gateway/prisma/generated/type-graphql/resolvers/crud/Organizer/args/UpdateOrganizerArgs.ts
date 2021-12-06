import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { OrganizerUpdateInput } from "../../../inputs/OrganizerUpdateInput";
import { OrganizerWhereUniqueInput } from "../../../inputs/OrganizerWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateOrganizerArgs {
  @TypeGraphQL.Field(_type => OrganizerUpdateInput, {
    nullable: false
  })
  data!: OrganizerUpdateInput;

  @TypeGraphQL.Field(_type => OrganizerWhereUniqueInput, {
    nullable: false
  })
  where!: OrganizerWhereUniqueInput;
}
