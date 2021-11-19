// TODO: Import relevant services here

export const typeDef = `
  extend type Query {
    _empty: String
  }

  type User {
    id: ID!
    name: String,
    current_queue: ID
  }
`;

export const resolvers = {
  Query: {

  }
};
