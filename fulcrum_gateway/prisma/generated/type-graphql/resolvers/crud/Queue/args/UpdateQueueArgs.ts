import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { QueueUpdateInput } from "../../../inputs/QueueUpdateInput";
import { QueueWhereUniqueInput } from "../../../inputs/QueueWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateQueueArgs {
  @TypeGraphQL.Field(_type => QueueUpdateInput, {
    nullable: false
  })
  data!: QueueUpdateInput;

  @TypeGraphQL.Field(_type => QueueWhereUniqueInput, {
    nullable: false
  })
  where!: QueueWhereUniqueInput;
}
