// @ts-nocheck to get err as uninferable type
// @ts-ignore
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { createClient } from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'

import { graphqlHTTP } from 'express-graphql';
import { buildSchema, NonEmptyArray } from 'type-graphql';
import {
  CreateOrganizerResolver,
  DeleteManyUserResolver,
  DeleteOrganizerResolver,
  FindFirstOrganizerResolver,
  FindManyOrganizerResolver,
  FindUniqueOrganizerResolver,
  GroupByOrganizerResolver,
  UpdateManyOrganizerResolver,
  UpdateOrganizerResolver,
  UpsertOrganizerResolver,

  FindFirstQueueResolver,
  FindManyQueueResolver,
  FindUniqueQueueResolver,
  GroupByOrganizerResolver,
  UpdateManyQueueResolver,
  UpdateQueueResolver,
  UpsertQueueResolver,

  DeleteManyUserResolver,
  DeleteUserResolver,
  FindFirstUserResolver,
  FindManyUserResolver,
  FindUniqueUserResolver,
  GroupByOrganizerResolver,
  UpdateManyUserResolver,
  UpdateUserResolver,
  UpsertUserResolver,
  relationResolvers
} from "../../prisma/generated/type-graphql";
import { customResolvers } from "./resolvers";

import { PrismaClient } from "@prisma/client";
import prisma from './prismaClient';
import * as path from 'path';

const pregeneratedCrudResolvers = [
  CreateOrganizerResolver,
  DeleteManyUserResolver,
  DeleteOrganizerResolver,
  FindFirstOrganizerResolver,
  FindManyOrganizerResolver,
  FindUniqueOrganizerResolver,
  GroupByOrganizerResolver,
  UpdateManyOrganizerResolver,
  UpdateOrganizerResolver,
  UpsertOrganizerResolver,

  FindFirstQueueResolver,
  FindManyQueueResolver,
  FindUniqueQueueResolver,
  GroupByOrganizerResolver,
  UpdateManyQueueResolver,
  UpdateQueueResolver,
  UpsertQueueResolver,

  DeleteManyUserResolver,
  DeleteUserResolver,
  FindFirstUserResolver,
  FindManyUserResolver,
  FindUniqueUserResolver,
  GroupByOrganizerResolver,
  UpdateManyUserResolver,
  UpdateUserResolver,
  UpsertUserResolver
];

const combinedResolvers = [...pregeneratedCrudResolvers, ...relationResolvers, ...customResolvers] as unknown as NonEmptyArray<Function>;

async function bootstrap(){

  const schema = await buildSchema({
    resolvers: combinedResolvers,
    validate: false,
    emitSchemaFile: __dirname + '/schema.graphql',
  });


  const app = express();
  const port = 8080;

  app.use(cors())

  const RedisStore = connectRedis(session)
  const redisClient = createClient()

  app.use(
      session({
        name: 'qid',
        store: new RedisStore({
          client: redisClient,
          disableTouch: true,
        }),
        cookie: {
          maxAge: 10000000000, //long time
          httpOnly: true,
          secure: false,  //cookie only works in https (we are developing)
          sameSite: 'lax'
        },
        saveUninitialized: false,
        secret: 'qiwroasdjlasddde', //you would want to hide this in production
        resave: false
      })
  )

  app.get('/', (req, res) => {
      res.redirect('/api')
  })
  app.use('/api', graphqlHTTP(async (req, res, params) => ({
    schema,
    context: { req, prisma },
    graphiql: true,
  })));

  app.listen(port, function(err){
      if (err) console.log(err);
      console.log("Server listening on PORT", port);
  });
}

bootstrap();
