import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { EnumQueueStateFilter } from "../inputs/EnumQueueStateFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { OrganizerRelationFilter } from "../inputs/OrganizerRelationFilter";
import { StringFilter } from "../inputs/StringFilter";
import { UserListRelationFilter } from "../inputs/UserListRelationFilter";

@TypeGraphQL.InputType("QueueWhereInput", {
  isAbstract: true
})
export class QueueWhereInput {
  @TypeGraphQL.Field(_type => [QueueWhereInput], {
    nullable: true
  })
  AND?: QueueWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [QueueWhereInput], {
    nullable: true
  })
  OR?: QueueWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [QueueWhereInput], {
    nullable: true
  })
  NOT?: QueueWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  organizer_id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  join_code?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  name?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  address?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => EnumQueueStateFilter, {
    nullable: true
  })
  state?: EnumQueueStateFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  capacity?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  max_party_size?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  grace_period?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  offline_time?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  create_time?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => OrganizerRelationFilter, {
    nullable: true
  })
  organizer?: OrganizerRelationFilter | undefined;

  @TypeGraphQL.Field(_type => UserListRelationFilter, {
    nullable: true
  })
  users?: UserListRelationFilter | undefined;
}
