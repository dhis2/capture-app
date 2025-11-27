import type { newPageStatuses } from './NewPage.constants';
import { dataElementTypes } from '../../../metaData';

type InputAttribute = {
  attribute: string;
  code: string;
  created: string;
  displayName: string;
  lastUpdated: string;
  value: string;
  valueType: keyof typeof dataElementTypes;
};

export type ContainerProps = {
  showMessageToSelectOrgUnitOnNewPage: () => void;
  showMessageToSelectProgramCategoryOnNewPage: () => void;
  showMessageThatCategoryOptionIsInvalidForOrgUnit: () => void;
  categoryOptionIsInvalidForOrgUnit: boolean;
  showDefaultViewOnNewPage: () => void;
  handleMainPageNavigation: () => void;
  currentScopeId: string;
  orgUnitSelectionIncomplete: boolean;
  programCategorySelectionIncomplete: boolean;
  missingCategoriesInProgramSelection: Array<{ name: string; id: string }>;
  newPageStatus: keyof typeof newPageStatuses;
  writeAccess: boolean;
  error: boolean;
  ready: boolean;
  programId?: string;
  newPageKey?: string;
  teiId?: string;
  trackedEntityName?: string;
  teiDisplayName?: string;
  trackedEntityInstanceAttributes?: Array<InputAttribute>;
};
