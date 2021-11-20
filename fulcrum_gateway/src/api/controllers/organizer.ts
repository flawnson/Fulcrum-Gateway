// TODO: Import relevant services here

// import test data
import {
  user_table,
  queue_table,
  organizer_table
} from './test_data';

export const typeDef = `
  extend type Query {
    """Get an organizer"""
    organizer(organizer_id: ID!): Organizer
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
    edit_queue(id: ID!, edits: QueueEdit): Queue
  }

  type Organizer {
    id: ID!
    name: String
    queues: [Queue]
  }
`;

export const resolvers = {
  Query: {
    queues(obj: any, args: any, context: any, info: any) {
      const organizer = find(organizer_table, { id: args.organizer_id})
      return organizer;
    }
  },
  Mutation: {
    //TODO
  },
  Organizer: {
    id(obj: any, args: any, context: any, info: any) {
      return obj.id;
    },
    name(obj: any, args: any, context: any, info: any) {
      return obj.name;
    },
    queues(obj: any, args: any, context: any, info: any) {
      //get organizer's queues from Queue table
      const organizer_queues = queue_table.filter(function (currentElement) {
        if (obj.queues.includes(currentElement.id)) {
          return true;
        }
        return false;
      });
      return organizer_queues;
    }
  }
};
