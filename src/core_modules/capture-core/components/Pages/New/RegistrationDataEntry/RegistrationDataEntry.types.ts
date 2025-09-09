import { dataElementTypes } from '../../../../metaData';

type InputAttribute = {
  attribute: string;
  code: string;
  created: string;
  displayName: string;
  lastUpdated: string;
  value: string;
  valueType: keyof typeof dataElementTypes;
};

export type OwnProps = {
  setScopeId: (scopeId: string) => void;
  selectedScopeId: string;
  dataEntryId: string;
  teiId?: string;
  newPageKey?: string;
  trackedEntityInstanceAttributes?: Array<InputAttribute>;
};

export type ContainerProps = {
  dataEntryIsReady: boolean;
  onSaveWithoutEnrollment: (teiPayload: any) => void;
  onSaveWithEnrollment: (enrollmentPayload: any, redirect: any) => void;
};
