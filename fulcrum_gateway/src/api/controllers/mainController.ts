// TODO: Import Services here

const { graphqlHTTP } = require('express-graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { merge } = require('lodash');

// import organizer schema and resolvers
const {
  typeDef: Organizer,
  resolvers: organizerResolvers,
} = require('./organizer.ts');

//import queue schema and resolvers
const {
  typeDef: Queue,
  resolvers: queueResolvers,
} = require('./queue.ts');

// base query
const Query = `
  type Query {
    _empty: String
  }
`;

// base resolver
const resolvers = {}

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
