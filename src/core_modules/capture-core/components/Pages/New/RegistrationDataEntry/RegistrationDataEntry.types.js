// @flow

import { dataElementTypes } from '../../../../metaData';

type InputAttribute = {
  attribute: string,
  code: string,
  created: string,
  displayName: string,
  lastUpdated: string,
  value: string,
  valueType: $Keys<typeof dataElementTypes>,
};

export type OwnProps = $ReadOnly<{|
  setScopeId: Function,
  selectedScopeId: string,
  dataEntryId: string,
  teiId?: ?string,
  trackedEntityInstanceAttributes?: Array<InputAttribute>,
|}>;

type ContainerProps = {|
  dataEntryIsReady: boolean,
  onSaveWithoutEnrollment: Function,
  onSaveWithEnrollment: Function,
|};

export type Props = $ReadOnly<{|
  ...OwnProps,
  ...CssClasses,
  ...ContainerProps
|}>;
