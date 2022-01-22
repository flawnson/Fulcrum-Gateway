import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { UserAvgAggregate } from "../outputs/UserAvgAggregate";
import { UserCountAggregate } from "../outputs/UserCountAggregate";
import { UserMaxAggregate } from "../outputs/UserMaxAggregate";
import { UserMinAggregate } from "../outputs/UserMinAggregate";
import { UserSumAggregate } from "../outputs/UserSumAggregate";
import { UserStatus } from "../../enums/UserStatus";

@TypeGraphQL.ObjectType("UserGroupBy", {
  isAbstract: true
})
export class UserGroupBy {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  id!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  summoned!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  phone_number!: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  party_size!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  last_online!: Date | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  index!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  join_time!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  reneged_time!: Date | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  total_wait!: number | null;

  @TypeGraphQL.Field(_type => UserStatus, {
    nullable: false
  })
  status!: "UNVERIFIED" | "KICKED" | "ENQUEUED" | "SERVICED" | "DEFERRED" | "ABANDONED" | "NOSHOW";

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  summoned_time!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  queue_id!: string;

  @TypeGraphQL.Field(_type => UserCountAggregate, {
    nullable: true
  })
  _count!: UserCountAggregate | null;

  @TypeGraphQL.Field(_type => UserAvgAggregate, {
    nullable: true
  })
  _avg!: UserAvgAggregate | null;

  @TypeGraphQL.Field(_type => UserSumAggregate, {
    nullable: true
  })
  _sum!: UserSumAggregate | null;

  @TypeGraphQL.Field(_type => UserMinAggregate, {
    nullable: true
  })
  _min!: UserMinAggregate | null;

  @TypeGraphQL.Field(_type => UserMaxAggregate, {
    nullable: true
  })
  _max!: UserMaxAggregate | null;
}
