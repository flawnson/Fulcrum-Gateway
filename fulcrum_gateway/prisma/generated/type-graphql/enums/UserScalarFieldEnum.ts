import * as TypeGraphQL from "type-graphql";

export enum UserScalarFieldEnum {
  id = "id",
  name = "name",
  queue_id = "queue_id",
  summoned = "summoned",
  password = "password",
  phone_number = "phone_number",
  party_size = "party_size",
  last_online = "last_online",
  index = "index",
  estimated_wait = "estimated_wait",
  join_time = "join_time",
  reneged_time = "reneged_time",
  state = "state"
}
TypeGraphQL.registerEnumType(UserScalarFieldEnum, {
  name: "UserScalarFieldEnum",
  description: undefined,
});
