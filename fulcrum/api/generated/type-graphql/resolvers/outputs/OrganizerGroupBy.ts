import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { OrganizerCountAggregate } from "../outputs/OrganizerCountAggregate";
import { OrganizerMaxAggregate } from "../outputs/OrganizerMaxAggregate";
import { OrganizerMinAggregate } from "../outputs/OrganizerMinAggregate";

@TypeGraphQL.ObjectType("OrganizerGroupBy", {
  isAbstract: true
})
export class OrganizerGroupBy {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  id!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  email!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  password!: string;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  confirmed!: boolean;

  @TypeGraphQL.Field(_type => OrganizerCountAggregate, {
    nullable: true
  })
  _count!: OrganizerCountAggregate | null;

  @TypeGraphQL.Field(_type => OrganizerMinAggregate, {
    nullable: true
  })
  _min!: OrganizerMinAggregate | null;

  @TypeGraphQL.Field(_type => OrganizerMaxAggregate, {
    nullable: true
  })
  _max!: OrganizerMaxAggregate | null;
}
