import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { QueueCreateManyInput } from "../../../inputs/QueueCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyQueueArgs {
  @TypeGraphQL.Field(_type => [QueueCreateManyInput], {
    nullable: false
  })
  data!: QueueCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
