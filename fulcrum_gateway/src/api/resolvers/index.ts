import * as customRelationResolversImport from "./relations";
import { NonEmptyArray } from "type-graphql";

export const customRelationResolvers = Object.values(customRelationResolversImport) as unknown as NonEmptyArray<Function>;

export const customResolvers = [
  ...customRelationResolvers
] as unknown as NonEmptyArray<Function>;
