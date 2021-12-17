// @ts-nocheck to get err as uninferable type
// @ts-ignore
import "reflect-metadata";
import express from "express";
import cors from "cors";

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

  DeleteManyQueueResolver,
  DeleteQueueResolver,
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

  DeleteManyQueueResolver,
  DeleteQueueResolver,
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

  //const prisma = new PrismaClient();

  const schema = await buildSchema({
    resolvers: combinedResolvers,
    validate: false,
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
