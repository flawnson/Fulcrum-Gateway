// @ts-nocheck to get err as uninferable type
// @ts-ignore
import "reflect-metadata";
import express from "express";
import cors from "cors";

import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'type-graphql';
import { resolvers } from "../../prisma/generated/type-graphql";
import { PrismaClient } from "@prisma/client";
import * as path from 'path';

async function bootstrap(){

  const prisma = new PrismaClient();

  const schema = await buildSchema({
    resolvers,
    validate: false,
    emitSchemaFile: true,
    emitSchemaFile: __dirname + '/schema.graphql',
  });


  const app = express();
  const port = 8080;

  app.use(cors())

  app.get('/', (req, res) => {
      res.redirect('/api')
  })
  app.use('/api', graphqlHTTP(async (req, res, params) => ({
    schema,
    context: { prisma },
    graphiql: true,
  })));

  app.listen(port, function(err){
      if (err) console.log(err);
      console.log("Server listening on PORT", port);
  });
}

bootstrap();
