import {
  ModelsEnhanceMap,
  ModelConfig
} from "../../prisma/generated/type-graphql";
import { Authorized, Extensions } from "type-graphql";

// define the decorators configs
const userEnhanceConfig: ModelConfig<"User"> = {
  fields: {
    name: [
      Authorized()
    ],
  },
};

export const modelsEnhanceMap: ModelsEnhanceMap = {
  User: userEnhanceConfig
};
