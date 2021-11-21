// TODO: Import relevant services here

import { find, filter } from 'lodash';

// import test data
import {
  user_table,
  queue_table,
  organizer_table
} from '../tests/test_data';

export const typeDef = `
  extend type Query {
    """Get a single queue"""
    queue(queue_id: ID!): Queue
  }

  extend type Mutation {
    """Create a queue"""
    create_queue(name: String): Queue

    """End a queue"""
    end_queue(id: ID!): String

    """Pause a queue"""
    pause_queue(id: ID!): String

    """Edit a queue"""
    edit_queue(id: ID!, edits: QueueEdit): Queue
  }

  enum QueueState {
    ACTIVE
    PAUSED
    INACTIVE
  }

  input QueueEdit {
    name: String
  }

  type Queue {
    id: ID!
    name: String,
    """The state of the queue: paused, active, inactive"""
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
    queue(obj: any, args: any, context: any, info: any){

      // get queue from database
      const queue_obj = find(queue_table, { id: args.queue_id});

      //calculate statistics (will be a helper function)
      const stats = {
        num_enqueued: 37,
        num_serviced: 23,
        num_deferred: 8,
        average_wait_time: 12.5,
        num_abandoned: 2,
        num_noshows: 0
      };

      //merge queue object with stats
      const queue = {...queue_obj, ...stats};

      return queue;
    }
  },
  Mutation: {
    //TODO
  },
  Queue: {
    //resolve non-scalar queue fields
    enqueued(obj: any, args: any, context: any, info: any) {
      //get all users in this list of user ids
      const users = user_table.filter(function (currentElement) {
        // check if user's queue id matches that of one of the ids
        if (obj.enqueued.includes(currentElement.id)) {
          return true;
        }
        return false;
      });
      return users;
    },
    serviced(obj: any, args: any, context: any, info: any) {
      //get all users in this list of user ids
      const users = user_table.filter(function (currentElement) {
        // check if user's queue id matches that of one of the ids
        if (obj.serviced.includes(currentElement.id)) {
          return true;
        }
        return false;
      });
      return users;
    },
    deferred(obj: any, args: any, context: any, info: any) {
      //get all users in this list of user ids
      const users = user_table.filter(function (currentElement) {
        // check if user's queue id matches that of one of the ids
        if (obj.deferred.includes(currentElement.id)) {
          return true;
        }
        return false;
      });
      return users;
    },
    abandoned(obj: any, args: any, context: any, info: any) {
      //get all users in this list of user ids
      const users = user_table.filter(function (currentElement) {
        // check if user's queue id matches that of one of the ids
        if (obj.abandoned.includes(currentElement.id)) {
          return true;
        }
        return false;
      });
      return users;
    },
    noshows(obj: any, args: any, context: any, info: any) {
      //get all users in this list of user ids
      const users = user_table.filter(function (currentElement) {
        // check if user's queue id matches that of one of the ids
        if (obj.noshows.includes(currentElement.id)) {
          return true;
        }
        return false;
      });
      return users;
    }
  }
};
