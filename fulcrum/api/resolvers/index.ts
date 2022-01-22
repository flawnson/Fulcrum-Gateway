import * as customRelationResolversImport from "./relations";
import * as customCrudResolversImport from "./crud";
import { NonEmptyArray } from "type-graphql";

export const customRelationResolvers = Object.values(customRelationResolversImport) as unknown as NonEmptyArray<Function>;
export const customCrudResolvers = Object.values(customCrudResolversImport) as unknown as NonEmptyArray<Function>;

export const customResolvers = [
  ...customRelationResolvers,
  ...customCrudResolvers
] as unknown as NonEmptyArray<Function>;
