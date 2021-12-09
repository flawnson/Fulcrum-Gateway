import * as TypeGraphQL from "type-graphql";

export enum QueueState {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  INACTIVE = "INACTIVE"
}
TypeGraphQL.registerEnumType(QueueState, {
  name: "QueueState",
  description: undefined,
});
