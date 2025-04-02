import type { ReactNode } from 'react';
import { enrollmentTypes } from './CardList.constants.ts';

type Attribute = {
  lastUpdated: string,
  code: string,
  displayName: string,
  created: string,
  valueType: string,
  attribute: string,
  value: string,
};

export type Tei = {
  created: string,
  orgUnit: string,
  trackedEntityInstance: string,
  lastUpdated: string,
  updatedAt: string,
  trackedEntityType: string,
  deleted: boolean,
  featureType: string,
  programOwners: any[],
  enrollments: any[],
  relationships?: any[] | null,
  attributes: Attribute[],
};

export type ListItem = {
  readonly id: string,
  readonly values: {
    [elementId: string]: any,
  },
  readonly tei: Tei,
};

type RenderCustomCardActionsProps = {
  item: ListItem,
  programName?: string,
  enrollmentType: keyof typeof enrollmentTypes,
  programId?: string,
  currentSearchScopeType?: string,
};

export type RenderCustomCardActions = (props: RenderCustomCardActionsProps) => ReactNode;
