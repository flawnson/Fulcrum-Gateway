// TODO: Import relevant services here

export const typeDef = `
  extend type Query {
    _empty: String
  }

  type Queue {
    id: ID!
    name: String,
    queuers: [User]
  }
`;

export const resolvers = {
  Query: {

  },
  Queue: {
    //resolve queuers field
    queuers: () => {
      return [];
    }
  }
};
