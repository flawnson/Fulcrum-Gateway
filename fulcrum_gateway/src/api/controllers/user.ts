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
    """Get a single user"""
    user(user_id: ID!): User
  }

  type User {
    id: ID!
    name: String,
    current_queue: ID
  }
`;

export const resolvers = {
  Query: {
    user(obj: any, args: any, context: any, info: any) {
      const user = find(user_table, { id: args.user_id})
      return user;
    }
  },
  User: {

  }
};
