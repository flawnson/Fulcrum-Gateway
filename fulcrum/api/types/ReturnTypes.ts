import {
  createUnionType
} from "type-graphql";

import { User } from "../generated/type-graphql/models/User";
import { Queue } from "../generated/type-graphql/models/Queue";
import { Organizer } from "../generated/type-graphql/models/Organizer";

import { Error } from "./Error";

export const UserResult = createUnionType({
  name: "UserResult", // the name of the GraphQL union
  types: () => [User, Error] as const, // function that returns tuple of object types classes
  // our implementation of detecting returned object type
  resolveType: value => {
    if ("error" in value) {
      return Error; // we can return object type class (the one with `@ObjectType()`)
    }
    if ("id" in value) {
      return User; // or the schema name of the type as a string
    }
    return null;
  }
});

export const QueueResult = createUnionType({
  name: "QueueResult", // the name of the GraphQL union
  types: () => [Queue, Error] as const, // function that returns tuple of object types classes
  // our implementation of detecting returned object type
  resolveType: value => {
    if ("error" in value) {
      return Error; // we can return object type class (the one with `@ObjectType()`)
    }
    if ("id" in value) {
      return Queue; // or the schema name of the type as a string
    }
    return null;
  }
});

export const OrganizerResult = createUnionType({
  name: "OrganizerResult", // the name of the GraphQL union
  types: () => [Organizer, Error] as const, // function that returns tuple of object types classes
  // our implementation of detecting returned object type
  resolveType: value => {
    if ("error" in value) {
      return Error; // we can return object type class (the one with `@ObjectType()`)
    }
    if ("id" in value) {
      return Organizer; // or the schema name of the type as a string
    }
    return null;
  }
});
