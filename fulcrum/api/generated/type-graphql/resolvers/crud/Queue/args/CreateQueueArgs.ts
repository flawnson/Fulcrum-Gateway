import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { QueueCreateInput } from "../../../inputs/QueueCreateInput";

@TypeGraphQL.ArgsType()
export class CreateQueueArgs {
  @TypeGraphQL.Field(_type => QueueCreateInput, {
    nullable: false
  })
  data!: QueueCreateInput;
}
