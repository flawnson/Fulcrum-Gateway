import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueWhereInput } from "../inputs/QueueWhereInput";

@TypeGraphQL.InputType("QueueListRelationFilter", {
  isAbstract: true
})
export class QueueListRelationFilter {
  @TypeGraphQL.Field(_type => QueueWhereInput, {
    nullable: true
  })
  every?: QueueWhereInput | undefined;

  @TypeGraphQL.Field(_type => QueueWhereInput, {
    nullable: true
  })
  some?: QueueWhereInput | undefined;

  @TypeGraphQL.Field(_type => QueueWhereInput, {
    nullable: true
  })
  none?: QueueWhereInput | undefined;
}
