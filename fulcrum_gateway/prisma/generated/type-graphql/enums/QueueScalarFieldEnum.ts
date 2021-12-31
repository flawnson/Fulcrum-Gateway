import * as TypeGraphQL from "type-graphql";

export enum QueueScalarFieldEnum {
  id = "id",
  organizer_id = "organizer_id",
  join_code = "join_code",
  name = "name",
  address = "address",
  state = "state",
  capacity = "capacity",
  max_party_size = "max_party_size",
  grace_period = "grace_period",
  offline_time = "offline_time",
  create_time = "create_time",
  password = "password"
}
TypeGraphQL.registerEnumType(QueueScalarFieldEnum, {
  name: "QueueScalarFieldEnum",
  description: undefined,
});
