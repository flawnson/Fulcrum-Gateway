import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { OrganizerUpdateManyMutationInput } from "../../../inputs/OrganizerUpdateManyMutationInput";
import { OrganizerWhereInput } from "../../../inputs/OrganizerWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyOrganizerArgs {
  @TypeGraphQL.Field(_type => OrganizerUpdateManyMutationInput, {
    nullable: false
  })
  data!: OrganizerUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => OrganizerWhereInput, {
    nullable: true
  })
  where?: OrganizerWhereInput | undefined;
}
