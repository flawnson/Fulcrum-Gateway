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
    create_queue(data: QueueCreate): Queue

    """End a queue"""
    end_queue(id: ID!): ID

    """Pause a queue"""
    pause_queue(id: ID!): ID

    """Edit a queue's properties"""
    edit_queue(id: ID!, edits: QueueEdit): ID
  }

  enum QueueState {
    ACTIVE
    PAUSED
    INACTIVE
  }

  """May be able to merge QueueEdit and QueueCreate"""
  input QueueEdit {
    name: String
  }

  input QueueCreate {
    name: String
  }

  type Queue {
    id: ID!
    name: String,
    """The state of the queue: paused, active, inactive"""
    address: String!,
    state: QueueState!,
    create_time: Date,
    capacity: Int!,
    grace_period: Int!,
    max_party_size: Int!,
    offline_time: Int!,
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
    create_queue(obj: any, args: any, context: any, info: any) {
      let new_queue = {
        id: Date.now()+ "", //assign random id for now
        name: args.data.name,
        address: "here, there, anywhere, everywhere",
        state: "INACTIVE",
        create_time: new Date(),
        capacity: 10,
        grace_period: 2,
        max_party_size: 4,
        offline_time: 5,
        enqueued: [],
        serviced: [],
        deferred: [],
        abandoned: [],
        noshows: []
      };
      queue_table.push(new_queue);
      return new_queue;
    },
    end_queue(obj: any, args: any, context: any, info: any) {
      for (let i = 0; i < queue_table.length; i++) {
        if (queue_table[i].id === args.id) {
          // TODO: Need to check if there are still users in this queue
          queue_table.splice(i,1);
          return args.id;
        }
      }
      return null;
    },
    pause_queue(obj: any, args: any, context: any, info: any) {
      for (let i = 0; i < queue_table.length; i++){
        if (queue_table[i].id == args.id) {
          queue_table[i].state = "PAUSED";
          return args.id;
        }
      }
      return null;
    },
    edit_queue(obj: any, args: any, context: any, info: any) {
      for (let i = 0; i < queue_table.length; i++){
        if (queue_table[i].id == args.id) {
          if ("name" in args.edits){
            queue_table[i].name = args.edits.name;
          }
          return queue_table[i].id;
        }
      }
      return null;
    }
  },
  Queue: {
    //resolve non-scalar queue fields
    enqueued(obj: any, args: any, context: any, info: any) {
      //get all users in this list of user ids
      const users = user_table.filter(function (currentElement) {
        // check if user's queue id matches that of one of the ids
        return !!obj.enqueued.includes(currentElement.id);

      });
      return users;
    },
    serviced(obj: any, args: any, context: any, info: any) {
      //get all users in this list of user ids
      const users = user_table.filter(function (currentElement) {
        // check if user's queue id matches that of one of the ids
        return !!obj.serviced.includes(currentElement.id);

      });
      return users;
    },
    deferred(obj: any, args: any, context: any, info: any) {
      //get all users in this list of user ids
      const users = user_table.filter(function (currentElement) {
        // check if user's queue id matches that of one of the ids
        return !!obj.deferred.includes(currentElement.id);

      });
      return users;
    },
    abandoned(obj: any, args: any, context: any, info: any) {
      //get all users in this list of user ids
      const users = user_table.filter(function (currentElement) {
        // check if user's queue id matches that of one of the ids
        return !!obj.abandoned.includes(currentElement.id);

      });
      return users;
    },
    noshows(obj: any, args: any, context: any, info: any) {
      //get all users in this list of user ids
      const users = user_table.filter(function (currentElement) {
        // check if user's queue id matches that of one of the ids
        return !!obj.noshows.includes(currentElement.id);

      });
      return users;
    }
  }
};
