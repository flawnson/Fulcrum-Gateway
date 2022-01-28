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
  finish_time = "finish_time",
  status = "status",
  summoned_time = "summoned_time",
  queue_id = "queue_id"
}
TypeGraphQL.registerEnumType(UserScalarFieldEnum, {
  name: "UserScalarFieldEnum",
  description: undefined,
});
