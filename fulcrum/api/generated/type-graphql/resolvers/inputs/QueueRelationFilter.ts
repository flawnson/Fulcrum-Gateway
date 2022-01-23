import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { QueueWhereInput } from "../inputs/QueueWhereInput";

@TypeGraphQL.InputType("QueueRelationFilter", {
  isAbstract: true
})
export class QueueRelationFilter {
  @TypeGraphQL.Field(_type => QueueWhereInput, {
    nullable: true
  })
  is?: QueueWhereInput | undefined;

  @TypeGraphQL.Field(_type => QueueWhereInput, {
    nullable: true
  })
  isNot?: QueueWhereInput | undefined;
}
