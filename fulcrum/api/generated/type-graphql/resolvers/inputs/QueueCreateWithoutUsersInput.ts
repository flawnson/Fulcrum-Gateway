import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { OrganizerCreateNestedOneWithoutQueuesInput } from "../inputs/OrganizerCreateNestedOneWithoutQueuesInput";
import { QueueState } from "../../enums/QueueState";

@TypeGraphQL.InputType("QueueCreateWithoutUsersInput", {
  isAbstract: true
})
export class QueueCreateWithoutUsersInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  id?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  join_code!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  address!: string;

  @TypeGraphQL.Field(_type => QueueState, {
    nullable: true
  })
  state?: "ACTIVE" | "PAUSED" | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  capacity!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  max_party_size?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  grace_period?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  offline_time?: number | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  create_time!: Date;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  password!: string;

  @TypeGraphQL.Field(_type => OrganizerCreateNestedOneWithoutQueuesInput, {
    nullable: false
  })
  organizer!: OrganizerCreateNestedOneWithoutQueuesInput;
}
