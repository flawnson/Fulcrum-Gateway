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
import { buildSchema, buildSchemaSync, NonEmptyArray } from 'type-graphql';
import {
  relationResolvers,
  applyModelsEnhanceMap
} from "./generated/type-graphql";
import { modelsEnhanceMap } from "./modelsEnhanceMap";

import { customResolvers } from "./resolvers";

import * as path from 'path';
import prisma from './prismaClient';
import { redis } from "./redisClient";
import { authChecker } from "./middleware/authChecker";

const pregeneratedCrudResolvers = [
  // Currently not using any
];

const combinedResolvers = [...pregeneratedCrudResolvers, ...relationResolvers, ...customResolvers] as unknown as NonEmptyArray<Function>;

// apply the config (it will apply decorators on the generated model class and its properties)
applyModelsEnhanceMap(modelsEnhanceMap);


const schema = buildSchemaSync({
  resolvers: combinedResolvers,
  authChecker: authChecker,
  validate: false,
  emitSchemaFile: true,
  emitSchemaFile: __dirname + '/schema.graphql',
});

const app = express();
const port = 8080;

const originUrl =
process.env.NODE_ENV === "production"
  ? process.env.FRONTEND_PROD_URL
  : process.env.FRONTEND_LOCAL_URL;

app.use(
  cors({
    credentials: true,
    origin: originUrl
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
        secure: process.env.NODE_ENV === "production",  //cookie only works in https (we are developing) - set to true for production
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
  schema: schema,
  context: { req, res, prisma },
  graphiql: true,
})));

//module.exports = app;
export default app;
