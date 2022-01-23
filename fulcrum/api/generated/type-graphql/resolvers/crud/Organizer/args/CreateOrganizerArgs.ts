import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { OrganizerCreateInput } from "../../../inputs/OrganizerCreateInput";

@TypeGraphQL.ArgsType()
export class CreateOrganizerArgs {
  @TypeGraphQL.Field(_type => OrganizerCreateInput, {
    nullable: false
  })
  data!: OrganizerCreateInput;
}
