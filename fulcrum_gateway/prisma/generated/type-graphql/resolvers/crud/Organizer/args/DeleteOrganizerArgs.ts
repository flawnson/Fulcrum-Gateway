import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { OrganizerWhereUniqueInput } from "../../../inputs/OrganizerWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteOrganizerArgs {
  @TypeGraphQL.Field(_type => OrganizerWhereUniqueInput, {
    nullable: false
  })
  where!: OrganizerWhereUniqueInput;
}
