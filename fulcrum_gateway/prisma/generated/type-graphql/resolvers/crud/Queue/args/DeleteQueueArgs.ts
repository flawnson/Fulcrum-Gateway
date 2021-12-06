import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { QueueWhereUniqueInput } from "../../../inputs/QueueWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteQueueArgs {
  @TypeGraphQL.Field(_type => QueueWhereUniqueInput, {
    nullable: false
  })
  where!: QueueWhereUniqueInput;
}
