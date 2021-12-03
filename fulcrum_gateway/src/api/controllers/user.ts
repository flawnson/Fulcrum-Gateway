// TODO: Import relevant services here

import { find, filter } from 'lodash';

// import test data
import {
  user_table,
  queue_table,
  organizer_table,
  pastDate,
  futureDate,
  nowDate
} from '../tests/test_data';

export const typeDef = `
  scalar Date

  extend type Query {
    """Get a single user"""
    user(user_id: ID!): User
  }
  
  extend type Mutation {
    """Join a queue"""
    create_user(data: UserCreate!): User
    
    """Defer your position"""
    defer_position(data: DeferPosition!): User
    
    """Summon a user"""
    summon_user(user_id: ID!): String
    
  }
  
  input UserCreate {
    name: String
    phone_number: Int
  }
  
  input DeferPosition {
    name: String
    phone_number: Int
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
    create_user(obj: any, args: any, context: any, info: any) {
        let new_user = {
          id: Date.now() + "", //assign random unique id for now
          name: args.data.name,
          queue_id: "costco_queue1",
          online: true,
          summoned: false,
          phone_number: "6210001000",
          party_size: 1,
          last_online: nowDate,
          index: 1,
          estimated_wait: 3,
          average_wait: 17,
          join_time: pastDate,
          reneged_time: futureDate,
        };
        user_table.push(new_user); //add to table
        return new_user;
      },
    defer_position(obj: any, args: any, context: any, info: any) {
      return null
    },
    summon_user(obj: any, args: any, context: any, info: any) {
      const idx = user_table.findIndex((obj => obj.id == args.user_id))
      user_table[idx].summoned = !user_table[idx].summoned
      return "YEETUS";
    },
  },
  User: {

  }
};
