import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { OrganizerOrderByWithRelationInput } from "../../../inputs/OrganizerOrderByWithRelationInput";
import { OrganizerWhereInput } from "../../../inputs/OrganizerWhereInput";
import { OrganizerWhereUniqueInput } from "../../../inputs/OrganizerWhereUniqueInput";
import { OrganizerScalarFieldEnum } from "../../../../enums/OrganizerScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindManyOrganizerArgs {
  @TypeGraphQL.Field(_type => OrganizerWhereInput, {
    nullable: true
  })
  where?: OrganizerWhereInput | undefined;

  @TypeGraphQL.Field(_type => [OrganizerOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: OrganizerOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => OrganizerWhereUniqueInput, {
    nullable: true
  })
  cursor?: OrganizerWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [OrganizerScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "name"> | undefined;
}
