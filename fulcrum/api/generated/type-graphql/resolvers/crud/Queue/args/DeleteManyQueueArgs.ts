import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { QueueWhereInput } from "../../../inputs/QueueWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyQueueArgs {
  @TypeGraphQL.Field(_type => QueueWhereInput, {
    nullable: true
  })
  where?: QueueWhereInput | undefined;
}
