// @flow
import { type Node } from 'react';
import { typeof enrollmentTypes } from './CardList.constants';

export type Tei = $ReadOnly<{
  created: string,
  orgUnit: string,
  trackedEntityInstance: string,
  lastUpdated: string,
  trackedEntityType: string,
  deleted: boolean,
  featureType: string,
  programOwners: Array<any>,
  enrollments: Array<any>,
  relationships: ?Array<any>,
  orgUnit: string,
  attributes: Array<{
    lastUpdated: string,
    code: string,
    displayName: string,
    created: string,
    valueType: string,
    attribute: string,
    value: string
  }>
}>

export type ListItem = {|
  +id: string,
  +values: {
    [elementId: string]: any,
  },
  +tei: Tei,
|}

export type RenderCustomCardActions = ({
  item: ListItem,
  programName?: string,
  enrollmentType: $Keys<enrollmentTypes>,
  programId?: string,
  currentSearchScopeType?: string
}) => Node
