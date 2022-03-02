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
import { cookieName } from "./constants"
import { rateLimiter } from './middleware/rateLimiter';

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
(process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test")
  ? process.env.FRONTEND_PROD_URL
  : process.env.FRONTEND_LOCAL_URL;

app.use(
  cors({
    credentials: true,
    origin: originUrl
  })
);

const RedisStore = connectRedis(session)

const cookieConfig = {
  name: cookieName,
  store: new RedisStore({
    client: redis,
    disableTouch: true,
  }),
  cookie: {
    maxAge: 3000000000, //long time (~1 month)
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",  //cookie only works in https (we are developing) - set to true for production
    //sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax'
    sameSite: 'lax'
    //secure: false
  },
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET, //you would want to hide this in production
  resave: false
}

console.log("Cookie Config");
console.log(cookieConfig);

if (process.env.NODE_ENV === "production"){
  console.log("Trusting Proxy");
  app.set('trust proxy', 1) // trust first proxy
}
app.use(
    session(cookieConfig)
)

// // use rate limiter if in test or production only
// if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"){
//     app.use(rateLimiter);
// }

app.use(rateLimiter);

app.get('/', (req, res) => {
  res.redirect('/api')
})

app.use('/api', graphqlHTTP(async (req, res, params) => ({
  schema: schema,
  context: { req, res, prisma },
  graphiql: (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") ? false : true,
})));

//module.exports = app;
export default app;
