import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { OrganizerWhereInput } from "../../../inputs/OrganizerWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyOrganizerArgs {
  @TypeGraphQL.Field(_type => OrganizerWhereInput, {
    nullable: true
  })
  where?: OrganizerWhereInput | undefined;
}
