// @flow
import { StorageController } from 'capture-core-utils/storage';
import type { QueryApiFn } from '../loader.types';

type StoreNames = {
  CONSTANTS: string,
  ORGANISATION_UNIT_LEVELS: string,
  ORGANISATION_UNIT_GROUPS: string,
  RELATIONSHIP_TYPES: string,
  TRACKED_ENTITY_TYPES: string,
  PROGRAMS: string,
  PROGRAM_RULES: string,
  PROGRAM_RULES_VARIABLES: string,
  PROGRAM_INDICATORS: string,
  TRACKED_ENTITY_ATTRIBUTES: string,
  OPTION_SETS: string,
  CATEGORIES: string,
  CATEGORY_OPTIONS_BY_CATEGORY: string,
  CATEGORY_OPTIONS: string,
  REDUX_PERSIST: string,
};

export type ContextInput = {
  onQueryApi: QueryApiFn,
  storageController: StorageController,
  storeNames: StoreNames,
};
