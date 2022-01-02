import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { OrganizerWhereUniqueInput } from "../../../inputs/OrganizerWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueOrganizerArgs {
  @TypeGraphQL.Field(_type => OrganizerWhereUniqueInput, {
    nullable: false
  })
  where!: OrganizerWhereUniqueInput;
}
