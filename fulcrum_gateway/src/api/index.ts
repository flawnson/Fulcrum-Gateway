// @ts-nocheck to get err as uninferable type
// @ts-ignore
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { createClient } from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import * as dotenv from 'dotenv';
dotenv.config();

import { graphqlHTTP } from 'express-graphql';
import { buildSchema, NonEmptyArray } from 'type-graphql';
import {
  relationResolvers
} from "../../prisma/generated/type-graphql";

import {
  applyModelsEnhanceMap
} from "../../prisma/generated/type-graphql";
import { modelsEnhanceMap } from "./modelsEnhanceMap";

import { customResolvers } from "./resolvers";

import * as path from 'path';
import { PrismaClient } from "@prisma/client";
import prisma from './prismaClient';
import { redis } from "./redisClient";
import { authChecker } from "./middleware/authChecker";

const pregeneratedCrudResolvers = [
  // Currently not using any
];

const combinedResolvers = [...pregeneratedCrudResolvers, ...relationResolvers, ...customResolvers] as unknown as NonEmptyArray<Function>;

// apply the config (it will apply decorators on the generated model class and its properties)
applyModelsEnhanceMap(modelsEnhanceMap);

async function bootstrap(){

  const schema = await buildSchema({
    resolvers: combinedResolvers,
    authChecker: authChecker,
    validate: false,
    emitSchemaFile: __dirname + '/schema.graphql',
  });


  const app = express();
  const port = 8080;

  app.use(
      cors({
          credentials: true,
          origin: "http://localhost:19006"
      })
  );

  const RedisStore = connectRedis(session)

  app.use(
      session({
        name: 'qid',
        store: new RedisStore({
          client: redis,
          disableTouch: true,
        }),
        cookie: {
          maxAge: 10000000000, //long time
          httpOnly: true,
          secure: false,  //cookie only works in https (we are developing)
          sameSite: 'lax'
        },
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET, //you would want to hide this in production
        resave: false
      })
  )

  app.get('/', (req, res) => {
      res.redirect('/api')
  })
  app.use('/api', graphqlHTTP(async (req, res, params) => ({
    schema,
    context: { req, res, prisma },
    graphiql: true,
  })));

  app.listen(port, function(err){
      if (err) console.log(err);
      console.log("Server listening on PORT", port);
  });
}

bootstrap();
