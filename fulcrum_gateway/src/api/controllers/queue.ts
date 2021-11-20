// TODO: Import relevant services here

export const typeDef = `
  extend type Query {
    """Get a single queue"""
    queue(queue_id: ID!): Queue
  }

  enum QueueState {
    ACTIVE
    PAUSED
  }

  type QueueEdit {
    name: String
  }

  type Queue {
    id: ID!
    name: String,
    """The state of the queue: paused, active"""
    state: QueueState!,
    average_wait_time: Float,
    enqueued: [User]!,
    serviced: [User]!,
    deferred: [User]!,
    abandoned: [User]!,
    noshows: [User]!
  }
`;

export const resolvers = {
  Query: {
    //TODO
  },
  Queue: {
    //resolve queue fields
    enqueued: () => {
      return [];
    },
    serviced: () => {
      return [];
    }
    //TODO
  }
};
