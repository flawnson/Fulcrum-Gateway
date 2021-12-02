// TODO: Import relevant services here

import { find, filter } from 'lodash';

// import test data
import {
  user_table,
  queue_table,
  organizer_table
} from '../tests/test_data';

export const typeDef = `
  scalar Date

  extend type Query {
    """Get a single user"""
    user(user_id: ID!): User
  }
  
  extend type Mutation {
    """Create a queue"""
    summon_user(user_id: ID!): String
  }

  type User {
    id: ID!
    name: String
    queue_id: ID
    online: Boolean
    summoned: Boolean
    phone_number: String
    party_size: Int
    last_online: Date
    index: Int
    estimated_wait: Int
    average_wait: Int
    join_time: Date
    reneged_time: Date
  }
`;

export const resolvers = {
  Query: {
    user(obj: any, args: any, context: any, info: any) {
      const user = find(user_table, { id: args.user_id})
      return user;
    }
  },
  Mutation: {
    summon_user(obj: any, args: any, context: any, info: any) {
      const idx = user_table.findIndex((obj => obj.id == args.user_id))
      user_table[idx].summoned = !user_table[idx].summoned
      return "YEETUS";
    },
  },
  User: {

  }
};
