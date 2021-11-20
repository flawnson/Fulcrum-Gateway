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
    num_enqueued: Int!,
    num_serviced: Int!,
    num_deferred: Int!,
    num_abandoned: Int!,
    num_noshows: Int!,
    enqueued: [User]!,
    serviced: [User]!,
    deferred: [User]!,
    abandoned: [User]!,
    noshows: [User]!
  }
`;

export const resolvers = {
  Query: {
    queue(){
      //calculate statistics
      const stats = {
        num_enqueued: 37,
        num_serviced: 23,
        num_deferrals: 8,
        average_wait_time: 12.5,
        num_abandoned: 2,
        num_noshows: 0
      }

      

    }
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
