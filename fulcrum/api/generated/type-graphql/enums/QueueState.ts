import * as TypeGraphQL from "type-graphql";

export enum QueueState {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED"
}
TypeGraphQL.registerEnumType(QueueState, {
  name: "QueueState",
  description: undefined,
});
