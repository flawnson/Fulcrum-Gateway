import {
  ModelsEnhanceMap,
  ModelConfig
} from "../../prisma/generated/type-graphql";
import { Authorized, Extensions } from "type-graphql";

// define the decorators configs for generated fields

const organizerEnhanceConfig: ModelConfig<"Organizer"> = {
  fields: {
    name: [Authorized(["ORGANIZER", "QUEUE_MANAGER"])],
    email: [Authorized(["ORGANIZER"])],
    password: [Authorized(["ORGANIZER"])],
    //note: no resolver for "confirmed" field
    queues: [Authorized(["ORGANIZER"])]
  }
};

const queueEnhanceConfig: ModelConfig<"Queue"> = {
  fields: {
    join_code: [Authorized()],
    name: [Authorized()],
    address: [Authorized()],
    state: [Authorized()],
    capacity: [Authorized(["ORGANIZER", "QUEUE_MANAGER"])],
    max_party_size: [Authorized()],
    grace_period: [Authorized(["ORGANIZER", "QUEUE_MANAGER"])],
    offline_time: [Authorized(["ORGANIZER", "QUEUE_MANAGER"])],
    create_time: [Authorized(["ORGANIZER", "QUEUE_MANAGER"])],
    users: [Authorized(["ORGANIZER", "QUEUE_MANAGER"])],
    password: [Authorized(["ORGANIZER", "QUEUE_MANAGER"])]
  }
};

const userEnhanceConfig: ModelConfig<"User"> = {
  fields: {
    name: [Authorized()],
    summoned: [Authorized()],
    phone_number: [Authorized()],
    party_size: [Authorized()],
    last_online: [Authorized(["ORGANIZER", "QUEUE_MANAGER"])],
    index: [Authorized()],
    join_time: [Authorized()],
    reneged_time: [Authorized(["ORGANIZER", "QUEUE_MANAGER"])],
    queue_id: [Authorized(["ORGANIZER", "QUEUE_MANAGER"])],
    queue: [Authorized()],
    total_wait: [Authorized(["ORGANIZER", "QUEUE_MANAGER"])],
    summoned_time: [Authorized()]
  }
};


export const modelsEnhanceMap: ModelsEnhanceMap = {
  User: userEnhanceConfig,
  Queue: queueEnhanceConfig,
  Organizer: organizerEnhanceConfig
};
