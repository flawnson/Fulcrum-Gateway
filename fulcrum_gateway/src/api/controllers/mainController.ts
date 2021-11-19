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

// base query
const Query = `
  type Query {
    _empty: String
  }
`;

// base resolver
const resolvers = {};

// master schema
const schema = makeExecutableSchema({
  typeDefs: [Query, Organizer, Queue],
  resolvers: merge(resolvers, organizerResolvers, queueResolvers)
});

const graphql = graphqlHTTP({
  schema,
  graphiql: true,
});

module.exports = graphql;
