import * as TypeGraphQL from "type-graphql";

export enum UserScalarFieldEnum {
  id = "id",
  name = "name",
  queue_id = "queue_id",
  summoned = "summoned",
  phone_number = "phone_number",
  party_size = "party_size",
  last_online = "last_online",
  index = "index",
  join_time = "join_time",
  reneged_time = "reneged_time",
  total_wait = "total_wait",
  status = "status",
  summoned_time = "summoned_time"
}
TypeGraphQL.registerEnumType(UserScalarFieldEnum, {
  name: "UserScalarFieldEnum",
  description: undefined,
});
