import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware,
  ObjectType,
  createUnionType
} from "type-graphql";

@ObjectType()
export class Error {
  @Field()
  error!: string;
}
