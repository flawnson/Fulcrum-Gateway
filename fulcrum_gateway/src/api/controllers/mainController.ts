import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { merge } from 'lodash';

// import organizer schema and resolvers
import {
  typeDef as Organizer,
  resolvers as organizerResolvers,
} from './organizer';

//import queue schema and resolvers
import {
  typeDef as Queue,
  resolvers as queueResolvers,
} from './queue';

//import user schema and resolvers
import {
  typeDef as User,
  resolvers as userResolvers,
} from './user';

// base schema
const Base = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

// base resolver
const resolvers = {};

// executable schema
const schema = makeExecutableSchema({
  typeDefs: [Base, Organizer, Queue, User],
  resolvers: merge(resolvers, organizerResolvers, queueResolvers, userResolvers)
});

const graphql = graphqlHTTP(async (req, res, params) => ({
  schema,
  graphiql: true,
}));

module.exports = graphql;
