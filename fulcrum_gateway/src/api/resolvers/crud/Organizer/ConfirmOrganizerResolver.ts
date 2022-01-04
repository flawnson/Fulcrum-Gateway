import { Resolver, Mutation, Arg } from "type-graphql";

import { redis } from "../../../redisClient";
import { Organizer } from "../../../../../prisma/generated/type-graphql/models/Organizer";
import { forgotOrganizerPasswordPrefix } from "../../../constants";


@ArgsType()
class ConfirmOrganizerArgs {

  @Field({
    nullable: false
  })
  token!: string;

}

@Resolver()
export class ConfirmOrganizerResolver {
  @Mutation(() => Boolean)
  async confirmOrganizer(@Ctx() { req, prisma }, @Args() args: ConfirmOrganizerArgs): Promise<boolean> {
    const organizerId = await redis.get(confirmOrganizerPrefix + token);

    if (!organizerId) {
      return false;
    }

    const update = await prisma.organizer.update({
      where: {
        id: organizerId
      },
      data: {
        confirmed: true
      }
    });

    await redis.del(confirmOrganizerPrefix + token);

    return true;
  }
}
