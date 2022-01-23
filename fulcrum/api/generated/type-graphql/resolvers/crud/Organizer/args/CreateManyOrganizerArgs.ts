import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { OrganizerCreateManyInput } from "../../../inputs/OrganizerCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyOrganizerArgs {
  @TypeGraphQL.Field(_type => [OrganizerCreateManyInput], {
    nullable: false
  })
  data!: OrganizerCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
