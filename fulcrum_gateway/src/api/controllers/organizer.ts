// TODO: Import relevant services here

export const typeDef = `
  extend type Query {
    """Get all queues for an organizer"""
    queues(organizer_id: ID!): [Queue]

    """Get a single queue"""
    queue(queue_id: ID!): Queue
  }

  extend type Mutation {
    """Create an organizer"""
    create_organizer(name: String!): Organizer

    """Create a queue"""
    create_queue(name: String): Queue

    """End a queue"""
    end_queue(id: ID!): String

    """Pause a queue"""
    pause_queue(id: ID!): String

    """Edit a queue"""
    edit_queue(id: ID!, name: String): Queue
  }

  type Organizer {
    id: ID!
    name: String
    queues: [Queue]
  }
`;

export const resolvers = {
  Query: {
    //TODO
  },
  Mutation: {
    //TODO
  },
  Organizer: {
    // resolve the queues list field
    queues: () => {
      return [];
    }
  }
};
