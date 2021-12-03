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
    """Get an organizer"""
    organizer(organizer_id: ID!): Organizer
  }

  extend type Mutation {
    """Create an organizer"""
    create_organizer(data: OrganizerCreate!): Organizer
  }

  input OrganizerCreate {
    name: String
  }

  type Organizer {
    id: ID!
    name: String
    queues: [Queue]
  }
`;

export const resolvers = {
  Query: {
    organizer(obj: any, args: any, context: any, info: any) {
      const organizer = find(organizer_table, { id: args.organizer_id})
      return organizer;
    }
  },
  Mutation: {
    create_organizer(obj: any, args: any, context: any, info: any) {
      let new_organizer = {
        id: Date.now() + "", //assign random unique id for now
        name: args.data.name,
        queues: []
      };
      organizer_table.push(new_organizer); //add to table
      return new_organizer;
    }
  },
  Organizer: {
    //resolve non-scalar organizer fields
    queues(obj: any, args: any, context: any, info: any) {
      //get organizer's queues from Queue table
      let organizer_queues = queue_table.filter(function (currentElement) {
        return !!obj.queues.includes(currentElement.id);

      });

      //calculate statistics for each queue
      //realistically would be a helper function
      for (let i = 0; i < organizer_queues.length; i++){
        let stats = {
          num_enqueued: 37,
          num_serviced: 23,
          num_deferred: 8,
          average_wait_time: 12.5,
          num_abandoned: 2,
          num_noshows: 0
        };
        // merge these two objects
        organizer_queues[i] = {...organizer_queues[i], ...stats};
      }

      return organizer_queues;
    }
  }
};
