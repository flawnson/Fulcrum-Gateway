import { ClassType } from "type-graphql";
import * as tslib from "tslib";
import * as crudResolvers from "./resolvers/crud/resolvers-crud.index";
import * as argsTypes from "./resolvers/crud/args.index";
import * as actionResolvers from "./resolvers/crud/resolvers-actions.index";
import * as relationResolvers from "./resolvers/relations/resolvers.index";
import * as models from "./models";
import * as outputTypes from "./resolvers/outputs";
import * as inputTypes from "./resolvers/inputs";

const crudResolversMap = {
  Organizer: crudResolvers.OrganizerCrudResolver,
  Queue: crudResolvers.QueueCrudResolver,
  User: crudResolvers.UserCrudResolver
};
const actionResolversMap = {
  Organizer: {
    organizer: actionResolvers.FindUniqueOrganizerResolver,
    findFirstOrganizer: actionResolvers.FindFirstOrganizerResolver,
    organizers: actionResolvers.FindManyOrganizerResolver,
    createOrganizer: actionResolvers.CreateOrganizerResolver,
    createManyOrganizer: actionResolvers.CreateManyOrganizerResolver,
    deleteOrganizer: actionResolvers.DeleteOrganizerResolver,
    updateOrganizer: actionResolvers.UpdateOrganizerResolver,
    deleteManyOrganizer: actionResolvers.DeleteManyOrganizerResolver,
    updateManyOrganizer: actionResolvers.UpdateManyOrganizerResolver,
    upsertOrganizer: actionResolvers.UpsertOrganizerResolver,
    aggregateOrganizer: actionResolvers.AggregateOrganizerResolver,
    groupByOrganizer: actionResolvers.GroupByOrganizerResolver
  },
  Queue: {
    queue: actionResolvers.FindUniqueQueueResolver,
    findFirstQueue: actionResolvers.FindFirstQueueResolver,
    queues: actionResolvers.FindManyQueueResolver,
    createQueue: actionResolvers.CreateQueueResolver,
    createManyQueue: actionResolvers.CreateManyQueueResolver,
    deleteQueue: actionResolvers.DeleteQueueResolver,
    updateQueue: actionResolvers.UpdateQueueResolver,
    deleteManyQueue: actionResolvers.DeleteManyQueueResolver,
    updateManyQueue: actionResolvers.UpdateManyQueueResolver,
    upsertQueue: actionResolvers.UpsertQueueResolver,
    aggregateQueue: actionResolvers.AggregateQueueResolver,
    groupByQueue: actionResolvers.GroupByQueueResolver
  },
  User: {
    user: actionResolvers.FindUniqueUserResolver,
    findFirstUser: actionResolvers.FindFirstUserResolver,
    users: actionResolvers.FindManyUserResolver,
    createUser: actionResolvers.CreateUserResolver,
    createManyUser: actionResolvers.CreateManyUserResolver,
    deleteUser: actionResolvers.DeleteUserResolver,
    updateUser: actionResolvers.UpdateUserResolver,
    deleteManyUser: actionResolvers.DeleteManyUserResolver,
    updateManyUser: actionResolvers.UpdateManyUserResolver,
    upsertUser: actionResolvers.UpsertUserResolver,
    aggregateUser: actionResolvers.AggregateUserResolver,
    groupByUser: actionResolvers.GroupByUserResolver
  }
};
const crudResolversInfo = {
  Organizer: ["organizer", "findFirstOrganizer", "organizers", "createOrganizer", "createManyOrganizer", "deleteOrganizer", "updateOrganizer", "deleteManyOrganizer", "updateManyOrganizer", "upsertOrganizer", "aggregateOrganizer", "groupByOrganizer"],
  Queue: ["queue", "findFirstQueue", "queues", "createQueue", "createManyQueue", "deleteQueue", "updateQueue", "deleteManyQueue", "updateManyQueue", "upsertQueue", "aggregateQueue", "groupByQueue"],
  User: ["user", "findFirstUser", "users", "createUser", "createManyUser", "deleteUser", "updateUser", "deleteManyUser", "updateManyUser", "upsertUser", "aggregateUser", "groupByUser"]
};
const argsInfo = {
  FindUniqueOrganizerArgs: ["where"],
  FindFirstOrganizerArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  FindManyOrganizerArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  CreateOrganizerArgs: ["data"],
  CreateManyOrganizerArgs: ["data", "skipDuplicates"],
  DeleteOrganizerArgs: ["where"],
  UpdateOrganizerArgs: ["data", "where"],
  DeleteManyOrganizerArgs: ["where"],
  UpdateManyOrganizerArgs: ["data", "where"],
  UpsertOrganizerArgs: ["where", "create", "update"],
  AggregateOrganizerArgs: ["where", "orderBy", "cursor", "take", "skip"],
  GroupByOrganizerArgs: ["where", "orderBy", "by", "having", "take", "skip"],
  FindUniqueQueueArgs: ["where"],
  FindFirstQueueArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  FindManyQueueArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  CreateQueueArgs: ["data"],
  CreateManyQueueArgs: ["data", "skipDuplicates"],
  DeleteQueueArgs: ["where"],
  UpdateQueueArgs: ["data", "where"],
  DeleteManyQueueArgs: ["where"],
  UpdateManyQueueArgs: ["data", "where"],
  UpsertQueueArgs: ["where", "create", "update"],
  AggregateQueueArgs: ["where", "orderBy", "cursor", "take", "skip"],
  GroupByQueueArgs: ["where", "orderBy", "by", "having", "take", "skip"],
  FindUniqueUserArgs: ["where"],
  FindFirstUserArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  FindManyUserArgs: ["where", "orderBy", "cursor", "take", "skip", "distinct"],
  CreateUserArgs: ["data"],
  CreateManyUserArgs: ["data", "skipDuplicates"],
  DeleteUserArgs: ["where"],
  UpdateUserArgs: ["data", "where"],
  DeleteManyUserArgs: ["where"],
  UpdateManyUserArgs: ["data", "where"],
  UpsertUserArgs: ["where", "create", "update"],
  AggregateUserArgs: ["where", "orderBy", "cursor", "take", "skip"],
  GroupByUserArgs: ["where", "orderBy", "by", "having", "take", "skip"]
};

type ResolverModelNames = keyof typeof crudResolversMap;

type ModelResolverActionNames<
  TModel extends ResolverModelNames
  > = keyof typeof crudResolversMap[TModel]["prototype"];

export type ResolverActionsConfig<
  TModel extends ResolverModelNames
  > = Partial<Record<ModelResolverActionNames<TModel> | "_all", MethodDecorator[]>>;

export type ResolversEnhanceMap = {
  [TModel in ResolverModelNames]?: ResolverActionsConfig<TModel>;
};

export function applyResolversEnhanceMap(
  resolversEnhanceMap: ResolversEnhanceMap,
) {
  for (const resolversEnhanceMapKey of Object.keys(resolversEnhanceMap)) {
    const modelName = resolversEnhanceMapKey as keyof typeof resolversEnhanceMap;
    const crudTarget = crudResolversMap[modelName].prototype;
    const resolverActionsConfig = resolversEnhanceMap[modelName]!;
    const actionResolversConfig = actionResolversMap[modelName];
    if (resolverActionsConfig._all) {
      const allActionsDecorators = resolverActionsConfig._all;
      const resolverActionNames = crudResolversInfo[modelName as keyof typeof crudResolversInfo];
      for (const resolverActionName of resolverActionNames) {
        const actionTarget = (actionResolversConfig[
          resolverActionName as keyof typeof actionResolversConfig
        ] as Function).prototype;
        tslib.__decorate(allActionsDecorators, crudTarget, resolverActionName, null);
        tslib.__decorate(allActionsDecorators, actionTarget, resolverActionName, null);
      }
    }
    const resolverActionsToApply = Object.keys(resolverActionsConfig).filter(
      it => it !== "_all"
    );
    for (const resolverActionName of resolverActionsToApply) {
      const decorators = resolverActionsConfig[
        resolverActionName as keyof typeof resolverActionsConfig
      ] as MethodDecorator[];
      const actionTarget = (actionResolversConfig[
        resolverActionName as keyof typeof actionResolversConfig
      ] as Function).prototype;
      tslib.__decorate(decorators, crudTarget, resolverActionName, null);
      tslib.__decorate(decorators, actionTarget, resolverActionName, null);
    }
  }
}

type ArgsTypesNames = keyof typeof argsTypes;

type ArgFieldNames<TArgsType extends ArgsTypesNames> = Exclude<
  keyof typeof argsTypes[TArgsType]["prototype"],
  number | symbol
>;

type ArgFieldsConfig<
  TArgsType extends ArgsTypesNames
  > = FieldsConfig<ArgFieldNames<TArgsType>>;

export type ArgConfig<TArgsType extends ArgsTypesNames> = {
  class?: ClassDecorator[];
  fields?: ArgFieldsConfig<TArgsType>;
};

export type ArgsTypesEnhanceMap = {
  [TArgsType in ArgsTypesNames]?: ArgConfig<TArgsType>;
};

export function applyArgsTypesEnhanceMap(
  argsTypesEnhanceMap: ArgsTypesEnhanceMap,
) {
  for (const argsTypesEnhanceMapKey of Object.keys(argsTypesEnhanceMap)) {
    const argsTypeName = argsTypesEnhanceMapKey as keyof typeof argsTypesEnhanceMap;
    const typeConfig = argsTypesEnhanceMap[argsTypeName]!;
    const typeClass = argsTypes[argsTypeName];
    const typeTarget = typeClass.prototype;
    applyTypeClassEnhanceConfig(
      typeConfig,
      typeClass,
      typeTarget,
      argsInfo[argsTypeName as keyof typeof argsInfo],
    );
  }
}

const relationResolversMap = {
  Organizer: relationResolvers.OrganizerRelationsResolver,
  Queue: relationResolvers.QueueRelationsResolver,
  User: relationResolvers.UserRelationsResolver
};
const relationResolversInfo = {
  Organizer: ["queues"],
  Queue: ["users", "organizer"],
  User: ["queue"]
};

type RelationResolverModelNames = keyof typeof relationResolversMap;

type RelationResolverActionNames<
  TModel extends RelationResolverModelNames
  > = keyof typeof relationResolversMap[TModel]["prototype"];

export type RelationResolverActionsConfig<TModel extends RelationResolverModelNames>
  = Partial<Record<RelationResolverActionNames<TModel> | "_all", MethodDecorator[]>>;

export type RelationResolversEnhanceMap = {
  [TModel in RelationResolverModelNames]?: RelationResolverActionsConfig<TModel>;
};

export function applyRelationResolversEnhanceMap(
  relationResolversEnhanceMap: RelationResolversEnhanceMap,
) {
  for (const relationResolversEnhanceMapKey of Object.keys(relationResolversEnhanceMap)) {
    const modelName = relationResolversEnhanceMapKey as keyof typeof relationResolversEnhanceMap;
    const relationResolverTarget = relationResolversMap[modelName].prototype;
    const relationResolverActionsConfig = relationResolversEnhanceMap[modelName]!;
    if (relationResolverActionsConfig._all) {
      const allActionsDecorators = relationResolverActionsConfig._all;
      const relationResolverActionNames = relationResolversInfo[modelName as keyof typeof relationResolversInfo];
      for (const relationResolverActionName of relationResolverActionNames) {
        tslib.__decorate(allActionsDecorators, relationResolverTarget, relationResolverActionName, null);
      }
    }
    const relationResolverActionsToApply = Object.keys(relationResolverActionsConfig).filter(
      it => it !== "_all"
    );
    for (const relationResolverActionName of relationResolverActionsToApply) {
      const decorators = relationResolverActionsConfig[
        relationResolverActionName as keyof typeof relationResolverActionsConfig
      ] as MethodDecorator[];
      tslib.__decorate(decorators, relationResolverTarget, relationResolverActionName, null);
    }
  }
}

type TypeConfig = {
  class?: ClassDecorator[];
  fields?: FieldsConfig;
};

type FieldsConfig<TTypeKeys extends string = string> = Partial<
  Record<TTypeKeys | "_all", PropertyDecorator[]>
>;

function applyTypeClassEnhanceConfig<
  TEnhanceConfig extends TypeConfig,
  TType extends object
>(
  enhanceConfig: TEnhanceConfig,
  typeClass: ClassType<TType>,
  typePrototype: TType,
  typeFieldNames: string[]
) {
  if (enhanceConfig.class) {
    tslib.__decorate(enhanceConfig.class, typeClass);
  }
  if (enhanceConfig.fields) {
    if (enhanceConfig.fields._all) {
      const allFieldsDecorators = enhanceConfig.fields._all;
      for (const typeFieldName of typeFieldNames) {
        tslib.__decorate(allFieldsDecorators, typePrototype, typeFieldName, void 0);
      }
    }
    const configFieldsToApply = Object.keys(enhanceConfig.fields).filter(
      it => it !== "_all"
    );
    for (const typeFieldName of configFieldsToApply) {
      const fieldDecorators = enhanceConfig.fields[typeFieldName]!;
      tslib.__decorate(fieldDecorators, typePrototype, typeFieldName, void 0);
    }
  }
}

const modelsInfo = {
  Organizer: ["id", "name", "email"],
  Queue: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "organizer_id"],
  User: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "summoned_time", "queue_id"]
};

type ModelNames = keyof typeof models;

type ModelFieldNames<TModel extends ModelNames> = Exclude<
  keyof typeof models[TModel]["prototype"],
  number | symbol
>;

type ModelFieldsConfig<TModel extends ModelNames> = FieldsConfig<
  ModelFieldNames<TModel>
>;

export type ModelConfig<TModel extends ModelNames> = {
  class?: ClassDecorator[];
  fields?: ModelFieldsConfig<TModel>;
};

export type ModelsEnhanceMap = {
  [TModel in ModelNames]?: ModelConfig<TModel>;
};

export function applyModelsEnhanceMap(modelsEnhanceMap: ModelsEnhanceMap) {
  for (const modelsEnhanceMapKey of Object.keys(modelsEnhanceMap)) {
    const modelName = modelsEnhanceMapKey as keyof typeof modelsEnhanceMap;
    const modelConfig = modelsEnhanceMap[modelName]!;
    const modelClass = models[modelName];
    const modelTarget = modelClass.prototype;
    applyTypeClassEnhanceConfig(
      modelConfig,
      modelClass,
      modelTarget,
      modelsInfo[modelName as keyof typeof modelsInfo],
    );
  }
}

const outputsInfo = {
  AggregateOrganizer: ["_count", "_min", "_max"],
  OrganizerGroupBy: ["id", "name", "email", "password", "confirmed", "_count", "_min", "_max"],
  AggregateQueue: ["_count", "_avg", "_sum", "_min", "_max"],
  QueueGroupBy: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "organizer_id", "_count", "_avg", "_sum", "_min", "_max"],
  AggregateUser: ["_count", "_avg", "_sum", "_min", "_max"],
  UserGroupBy: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue_id", "_count", "_avg", "_sum", "_min", "_max"],
  AffectedRowsOutput: ["count"],
  OrganizerCount: ["queues"],
  OrganizerCountAggregate: ["id", "name", "email", "password", "confirmed", "_all"],
  OrganizerMinAggregate: ["id", "name", "email", "password", "confirmed"],
  OrganizerMaxAggregate: ["id", "name", "email", "password", "confirmed"],
  QueueCount: ["users"],
  QueueCountAggregate: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "organizer_id", "_all"],
  QueueAvgAggregate: ["capacity", "max_party_size", "grace_period", "offline_time"],
  QueueSumAggregate: ["capacity", "max_party_size", "grace_period", "offline_time"],
  QueueMinAggregate: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "organizer_id"],
  QueueMaxAggregate: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "organizer_id"],
  UserCountAggregate: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue_id", "_all"],
  UserAvgAggregate: ["party_size", "index"],
  UserSumAggregate: ["party_size", "index"],
  UserMinAggregate: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue_id"],
  UserMaxAggregate: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue_id"]
};

type OutputTypesNames = keyof typeof outputTypes;

type OutputTypeFieldNames<TOutput extends OutputTypesNames> = Exclude<
  keyof typeof outputTypes[TOutput]["prototype"],
  number | symbol
>;

type OutputTypeFieldsConfig<
  TOutput extends OutputTypesNames
  > = FieldsConfig<OutputTypeFieldNames<TOutput>>;

export type OutputTypeConfig<TOutput extends OutputTypesNames> = {
  class?: ClassDecorator[];
  fields?: OutputTypeFieldsConfig<TOutput>;
};

export type OutputTypesEnhanceMap = {
  [TOutput in OutputTypesNames]?: OutputTypeConfig<TOutput>;
};

export function applyOutputTypesEnhanceMap(
  outputTypesEnhanceMap: OutputTypesEnhanceMap,
) {
  for (const outputTypeEnhanceMapKey of Object.keys(outputTypesEnhanceMap)) {
    const outputTypeName = outputTypeEnhanceMapKey as keyof typeof outputTypesEnhanceMap;
    const typeConfig = outputTypesEnhanceMap[outputTypeName]!;
    const typeClass = outputTypes[outputTypeName];
    const typeTarget = typeClass.prototype;
    applyTypeClassEnhanceConfig(
      typeConfig,
      typeClass,
      typeTarget,
      outputsInfo[outputTypeName as keyof typeof outputsInfo],
    );
  }
}

const inputsInfo = {
  OrganizerWhereInput: ["AND", "OR", "NOT", "id", "name", "email", "password", "confirmed", "queues"],
  OrganizerOrderByWithRelationInput: ["id", "name", "email", "password", "confirmed", "queues"],
  OrganizerWhereUniqueInput: ["id", "email"],
  OrganizerOrderByWithAggregationInput: ["id", "name", "email", "password", "confirmed", "_count", "_max", "_min"],
  OrganizerScalarWhereWithAggregatesInput: ["AND", "OR", "NOT", "id", "name", "email", "password", "confirmed"],
  QueueWhereInput: ["AND", "OR", "NOT", "id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "users", "password", "organizer_id", "organizer"],
  QueueOrderByWithRelationInput: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "users", "password", "organizer_id", "organizer"],
  QueueWhereUniqueInput: ["id", "join_code"],
  QueueOrderByWithAggregationInput: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "organizer_id", "_count", "_avg", "_max", "_min", "_sum"],
  QueueScalarWhereWithAggregatesInput: ["AND", "OR", "NOT", "id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "organizer_id"],
  UserWhereInput: ["AND", "OR", "NOT", "id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue_id", "queue"],
  UserOrderByWithRelationInput: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue_id", "queue"],
  UserWhereUniqueInput: ["id", "phone_number"],
  UserOrderByWithAggregationInput: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue_id", "_count", "_avg", "_max", "_min", "_sum"],
  UserScalarWhereWithAggregatesInput: ["AND", "OR", "NOT", "id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue_id"],
  OrganizerCreateInput: ["id", "name", "email", "password", "confirmed", "queues"],
  OrganizerUpdateInput: ["id", "name", "email", "password", "confirmed", "queues"],
  OrganizerCreateManyInput: ["id", "name", "email", "password", "confirmed"],
  OrganizerUpdateManyMutationInput: ["id", "name", "email", "password", "confirmed"],
  QueueCreateInput: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "users", "organizer"],
  QueueUpdateInput: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "users", "organizer"],
  QueueCreateManyInput: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "organizer_id"],
  QueueUpdateManyMutationInput: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password"],
  UserCreateInput: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue"],
  UserUpdateInput: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue"],
  UserCreateManyInput: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue_id"],
  UserUpdateManyMutationInput: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time"],
  StringFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "mode", "not"],
  BoolFilter: ["equals", "not"],
  QueueListRelationFilter: ["every", "some", "none"],
  QueueOrderByRelationAggregateInput: ["_count"],
  OrganizerCountOrderByAggregateInput: ["id", "name", "email", "password", "confirmed"],
  OrganizerMaxOrderByAggregateInput: ["id", "name", "email", "password", "confirmed"],
  OrganizerMinOrderByAggregateInput: ["id", "name", "email", "password", "confirmed"],
  StringWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "mode", "not", "_count", "_min", "_max"],
  BoolWithAggregatesFilter: ["equals", "not", "_count", "_min", "_max"],
  StringNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "mode", "not"],
  EnumQueueStateFilter: ["equals", "in", "notIn", "not"],
  IntFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  IntNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  DateTimeFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  UserListRelationFilter: ["every", "some", "none"],
  OrganizerRelationFilter: ["is", "isNot"],
  UserOrderByRelationAggregateInput: ["_count"],
  QueueCountOrderByAggregateInput: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "organizer_id"],
  QueueAvgOrderByAggregateInput: ["capacity", "max_party_size", "grace_period", "offline_time"],
  QueueMaxOrderByAggregateInput: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "organizer_id"],
  QueueMinOrderByAggregateInput: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "organizer_id"],
  QueueSumOrderByAggregateInput: ["capacity", "max_party_size", "grace_period", "offline_time"],
  StringNullableWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "mode", "not", "_count", "_min", "_max"],
  EnumQueueStateWithAggregatesFilter: ["equals", "in", "notIn", "not", "_count", "_min", "_max"],
  IntWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "_count", "_avg", "_sum", "_min", "_max"],
  IntNullableWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "_count", "_avg", "_sum", "_min", "_max"],
  DateTimeWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "_count", "_min", "_max"],
  DateTimeNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  EnumUserStatusFilter: ["equals", "in", "notIn", "not"],
  QueueRelationFilter: ["is", "isNot"],
  UserCountOrderByAggregateInput: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue_id"],
  UserAvgOrderByAggregateInput: ["party_size", "index"],
  UserMaxOrderByAggregateInput: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue_id"],
  UserMinOrderByAggregateInput: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue_id"],
  UserSumOrderByAggregateInput: ["party_size", "index"],
  DateTimeNullableWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "_count", "_min", "_max"],
  EnumUserStatusWithAggregatesFilter: ["equals", "in", "notIn", "not", "_count", "_min", "_max"],
  QueueCreateNestedManyWithoutOrganizerInput: ["create", "connectOrCreate", "createMany", "connect"],
  StringFieldUpdateOperationsInput: ["set"],
  BoolFieldUpdateOperationsInput: ["set"],
  QueueUpdateManyWithoutOrganizerInput: ["create", "connectOrCreate", "upsert", "createMany", "set", "disconnect", "delete", "connect", "update", "updateMany", "deleteMany"],
  UserCreateNestedManyWithoutQueueInput: ["create", "connectOrCreate", "createMany", "connect"],
  OrganizerCreateNestedOneWithoutQueuesInput: ["create", "connectOrCreate", "connect"],
  NullableStringFieldUpdateOperationsInput: ["set"],
  EnumQueueStateFieldUpdateOperationsInput: ["set"],
  IntFieldUpdateOperationsInput: ["set", "increment", "decrement", "multiply", "divide"],
  NullableIntFieldUpdateOperationsInput: ["set", "increment", "decrement", "multiply", "divide"],
  DateTimeFieldUpdateOperationsInput: ["set"],
  UserUpdateManyWithoutQueueInput: ["create", "connectOrCreate", "upsert", "createMany", "set", "disconnect", "delete", "connect", "update", "updateMany", "deleteMany"],
  OrganizerUpdateOneRequiredWithoutQueuesInput: ["create", "connectOrCreate", "upsert", "connect", "update"],
  QueueCreateNestedOneWithoutUsersInput: ["create", "connectOrCreate", "connect"],
  NullableDateTimeFieldUpdateOperationsInput: ["set"],
  EnumUserStatusFieldUpdateOperationsInput: ["set"],
  QueueUpdateOneRequiredWithoutUsersInput: ["create", "connectOrCreate", "upsert", "connect", "update"],
  NestedStringFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "not"],
  NestedBoolFilter: ["equals", "not"],
  NestedStringWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "not", "_count", "_min", "_max"],
  NestedIntFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  NestedBoolWithAggregatesFilter: ["equals", "not", "_count", "_min", "_max"],
  NestedStringNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "not"],
  NestedEnumQueueStateFilter: ["equals", "in", "notIn", "not"],
  NestedIntNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  NestedDateTimeFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  NestedStringNullableWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "contains", "startsWith", "endsWith", "not", "_count", "_min", "_max"],
  NestedEnumQueueStateWithAggregatesFilter: ["equals", "in", "notIn", "not", "_count", "_min", "_max"],
  NestedIntWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "_count", "_avg", "_sum", "_min", "_max"],
  NestedFloatFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  NestedIntNullableWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "_count", "_avg", "_sum", "_min", "_max"],
  NestedFloatNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  NestedDateTimeWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "_count", "_min", "_max"],
  NestedDateTimeNullableFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not"],
  NestedEnumUserStatusFilter: ["equals", "in", "notIn", "not"],
  NestedDateTimeNullableWithAggregatesFilter: ["equals", "in", "notIn", "lt", "lte", "gt", "gte", "not", "_count", "_min", "_max"],
  NestedEnumUserStatusWithAggregatesFilter: ["equals", "in", "notIn", "not", "_count", "_min", "_max"],
  QueueCreateWithoutOrganizerInput: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "users"],
  QueueCreateOrConnectWithoutOrganizerInput: ["where", "create"],
  QueueCreateManyOrganizerInputEnvelope: ["data", "skipDuplicates"],
  QueueUpsertWithWhereUniqueWithoutOrganizerInput: ["where", "update", "create"],
  QueueUpdateWithWhereUniqueWithoutOrganizerInput: ["where", "data"],
  QueueUpdateManyWithWhereWithoutOrganizerInput: ["where", "data"],
  QueueScalarWhereInput: ["AND", "OR", "NOT", "id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "organizer_id"],
  UserCreateWithoutQueueInput: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time"],
  UserCreateOrConnectWithoutQueueInput: ["where", "create"],
  UserCreateManyQueueInputEnvelope: ["data", "skipDuplicates"],
  OrganizerCreateWithoutQueuesInput: ["id", "name", "email", "password", "confirmed"],
  OrganizerCreateOrConnectWithoutQueuesInput: ["where", "create"],
  UserUpsertWithWhereUniqueWithoutQueueInput: ["where", "update", "create"],
  UserUpdateWithWhereUniqueWithoutQueueInput: ["where", "data"],
  UserUpdateManyWithWhereWithoutQueueInput: ["where", "data"],
  UserScalarWhereInput: ["AND", "OR", "NOT", "id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time", "queue_id"],
  OrganizerUpsertWithoutQueuesInput: ["update", "create"],
  OrganizerUpdateWithoutQueuesInput: ["id", "name", "email", "password", "confirmed"],
  QueueCreateWithoutUsersInput: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "organizer"],
  QueueCreateOrConnectWithoutUsersInput: ["where", "create"],
  QueueUpsertWithoutUsersInput: ["update", "create"],
  QueueUpdateWithoutUsersInput: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "organizer"],
  QueueCreateManyOrganizerInput: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password"],
  QueueUpdateWithoutOrganizerInput: ["id", "join_code", "name", "address", "state", "capacity", "max_party_size", "grace_period", "offline_time", "create_time", "password", "users"],
  UserCreateManyQueueInput: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time"],
  UserUpdateWithoutQueueInput: ["id", "name", "summoned", "phone_number", "party_size", "last_online", "index", "join_time", "finish_time", "status", "summoned_time"]
};

type InputTypesNames = keyof typeof inputTypes;

type InputTypeFieldNames<TInput extends InputTypesNames> = Exclude<
  keyof typeof inputTypes[TInput]["prototype"],
  number | symbol
>;

type InputTypeFieldsConfig<
  TInput extends InputTypesNames
  > = FieldsConfig<InputTypeFieldNames<TInput>>;

export type InputTypeConfig<TInput extends InputTypesNames> = {
  class?: ClassDecorator[];
  fields?: InputTypeFieldsConfig<TInput>;
};

export type InputTypesEnhanceMap = {
  [TInput in InputTypesNames]?: InputTypeConfig<TInput>;
};

export function applyInputTypesEnhanceMap(
  inputTypesEnhanceMap: InputTypesEnhanceMap,
) {
  for (const inputTypeEnhanceMapKey of Object.keys(inputTypesEnhanceMap)) {
    const inputTypeName = inputTypeEnhanceMapKey as keyof typeof inputTypesEnhanceMap;
    const typeConfig = inputTypesEnhanceMap[inputTypeName]!;
    const typeClass = inputTypes[inputTypeName];
    const typeTarget = typeClass.prototype;
    applyTypeClassEnhanceConfig(
      typeConfig,
      typeClass,
      typeTarget,
      inputsInfo[inputTypeName as keyof typeof inputsInfo],
    );
  }
}

