import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { QueueUpdateManyMutationInput } from "../../../inputs/QueueUpdateManyMutationInput";
import { QueueWhereInput } from "../../../inputs/QueueWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyQueueArgs {
  @TypeGraphQL.Field(_type => QueueUpdateManyMutationInput, {
    nullable: false
  })
  data!: QueueUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => QueueWhereInput, {
    nullable: true
  })
  where?: QueueWhereInput | undefined;
}
