import * as TypeGraphQL from "type-graphql";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../../../prisma/generated/type-graphql/helpers";
import { Organizer } from "../../../../../prisma/generated/type-graphql/models/Organizer";
import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import { OrganizerQueuesArgs } from "../../../../../prisma/generated/type-graphql/resolvers/relations/Organizer/args/OrganizerQueuesArgs";

@TypeGraphQL.Resolver(_of => Organizer)
export class CustomOrganizerResolver {

}
