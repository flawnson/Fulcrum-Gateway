import {
  ModelsEnhanceMap,
  ModelConfig
} from "../../prisma/generated/type-graphql";
import { Authorized, Extensions } from "type-graphql";

// define the decorators configs for generated fields

const userEnhanceConfig: ModelConfig<"User"> = {
  fields: {
    name: [Authorized()],
    summoned: [Authorized()],
    phone_number: [Authorized()],
    party_size: [Authorized()],
    last_online: [Authorized("ORGANIZER")],
    index: [Authorized()],
    join_time: [Authorized()],
    reneged_time: [Authorized("ORGANIZER")],
    queue_id: [Authorized("ORGANIZER")],
    queue: [Authorized()],
    total_wait: [Authorized("ORGANIZER")],
    summoned_time: [Authorized()]
  }
};

const queueEnhanceConfig: ModelConfig<"Queue"> = {
  fields: {
    join_code: [Authorized()],
    name: [Authorized()],
    address: [Authorized()],
    state: [Authorized()],
    capacity: [Authorized("ORGANIZER")],
    max_party_size: [Authorized()],
    grace_period: [Authorized("ORGANIZER")],
    offline_time: [Authorized("ORGANIZER")],
    create_time: [Authorized("ORGANIZER")],
    users: [Authorized("ORGANIZER")],
    password: [Authorized("ORGANIZER")]
  }
};

export const modelsEnhanceMap: ModelsEnhanceMap = {
  User: userEnhanceConfig,
  Queue: queueEnhanceConfig
};
