import * as TypeGraphQL from "type-graphql";

export enum UserScalarFieldEnum {
  id = "id",
  name = "name",
  summoned = "summoned",
  phone_number = "phone_number",
  party_size = "party_size",
  last_online = "last_online",
  index = "index",
  join_time = "join_time",
  reneged_time = "reneged_time",
  status = "status",
  queue_id = "queue_id",
  total_wait = "total_wait"
}
TypeGraphQL.registerEnumType(UserScalarFieldEnum, {
  name: "UserScalarFieldEnum",
  description: undefined,
});
