// TODO: Import relevant services here

export const typeDef = `
  extend type Query {
    """Get all queues"""
    queues: [Queue]

    """Get single queue (can get enqueued, serviced, abandoned)"""
    queue(id: ID!): Queue
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

  },
  Mutation: {

  },
  Organizer: {
    // resolve the queues list field
    queues: () => {
      return [];
    }
  }
};
