import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { QueueCreateInput } from "../../../inputs/QueueCreateInput";
import { QueueUpdateInput } from "../../../inputs/QueueUpdateInput";
import { QueueWhereUniqueInput } from "../../../inputs/QueueWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertQueueArgs {
  @TypeGraphQL.Field(_type => QueueWhereUniqueInput, {
    nullable: false
  })
  where!: QueueWhereUniqueInput;

  @TypeGraphQL.Field(_type => QueueCreateInput, {
    nullable: false
  })
  create!: QueueCreateInput;

  @TypeGraphQL.Field(_type => QueueUpdateInput, {
    nullable: false
  })
  update!: QueueUpdateInput;
}
