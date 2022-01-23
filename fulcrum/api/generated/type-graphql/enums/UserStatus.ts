import * as TypeGraphQL from "type-graphql";

export enum UserStatus {
  UNVERIFIED = "UNVERIFIED",
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
