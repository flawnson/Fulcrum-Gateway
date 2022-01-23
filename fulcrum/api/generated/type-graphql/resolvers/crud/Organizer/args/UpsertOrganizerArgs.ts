import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { OrganizerCreateInput } from "../../../inputs/OrganizerCreateInput";
import { OrganizerUpdateInput } from "../../../inputs/OrganizerUpdateInput";
import { OrganizerWhereUniqueInput } from "../../../inputs/OrganizerWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertOrganizerArgs {
  @TypeGraphQL.Field(_type => OrganizerWhereUniqueInput, {
    nullable: false
  })
  where!: OrganizerWhereUniqueInput;

  @TypeGraphQL.Field(_type => OrganizerCreateInput, {
    nullable: false
  })
  create!: OrganizerCreateInput;

  @TypeGraphQL.Field(_type => OrganizerUpdateInput, {
    nullable: false
  })
  update!: OrganizerUpdateInput;
}
