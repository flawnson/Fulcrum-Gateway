import {
  ModelsEnhanceMap,
  ModelConfig
} from "./generated/type-graphql";
import { Authorized, Extensions } from "type-graphql";

// define the decorators configs for generated fields

const organizerEnhanceConfig: ModelConfig<"Organizer"> = {
  fields: {
    name: [Authorized(["ORGANIZER", "ASSISTANT"])],
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
    capacity: [Authorized(["ORGANIZER", "ASSISTANT"])],
    max_party_size: [Authorized()],
    grace_period: [Authorized(["ORGANIZER", "ASSISTANT"])],
    offline_time: [Authorized(["ORGANIZER", "ASSISTANT"])],
    create_time: [Authorized(["ORGANIZER", "ASSISTANT"])],
    users: [Authorized(["ORGANIZER", "ASSISTANT"])],
    password: [Authorized(["ORGANIZER", "ASSISTANT"])]
  }
};

const userEnhanceConfig: ModelConfig<"User"> = {
  fields: {
    name: [Authorized()],
    summoned: [Authorized()],
    phone_number: [Authorized()],
    party_size: [Authorized()],
    last_online: [Authorized(["ORGANIZER", "ASSISTANT"])],
    index: [Authorized()],
    join_time: [Authorized()],
    reneged_time: [Authorized(["ORGANIZER", "ASSISTANT"])],
    queue_id: [Authorized(["ORGANIZER", "ASSISTANT"])],
    queue: [Authorized()],
    total_wait: [Authorized(["ORGANIZER", "ASSISTANT"])],
    summoned_time: [Authorized()]
  }
};


export const modelsEnhanceMap: ModelsEnhanceMap = {
  User: userEnhanceConfig,
  Queue: queueEnhanceConfig,
  Organizer: organizerEnhanceConfig
};
