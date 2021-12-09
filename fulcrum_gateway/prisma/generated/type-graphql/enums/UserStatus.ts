import * as TypeGraphQL from "type-graphql";

export enum UserStatus {
  KICKED = "KICKED",
  ENQUEUED = "ENQUEUED",
  SERVICED = "SERVICED",
  DEFERRED = "DEFERRED",
  ABANDONED = "ABANDONED",
  NOSHOW = "NOSHOW"
}
TypeGraphQL.registerEnumType(UserStatus, {
  name: "UserStatus",
  description: undefined,
});
