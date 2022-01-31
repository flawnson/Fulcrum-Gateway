import {
  Resolver,
  Query,
  FieldResolver,
  Authorized,
  Ctx,
  Root,
  Int
} from "type-graphql";
import { Organizer } from "../../../generated/type-graphql/models/Organizer";
import * as helpers from "../../../helpers";
import { Context } from "../../../context.interface";


@Resolver(of => Organizer)
export class CustomOrganizerResolver {

}
