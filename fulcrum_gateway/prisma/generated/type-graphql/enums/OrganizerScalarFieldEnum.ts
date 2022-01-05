import * as TypeGraphQL from "type-graphql";

export enum OrganizerScalarFieldEnum {
  id = "id",
  name = "name",
  email = "email",
  password = "password",
  confirmed = "confirmed"
}
TypeGraphQL.registerEnumType(OrganizerScalarFieldEnum, {
  name: "OrganizerScalarFieldEnum",
  description: undefined,
});
