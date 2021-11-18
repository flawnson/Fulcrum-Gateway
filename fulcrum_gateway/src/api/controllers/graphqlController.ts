const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// TODO: Import Services here

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`

`);

const root = {

};

const graphql = graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
});

module.exports = graphql;
