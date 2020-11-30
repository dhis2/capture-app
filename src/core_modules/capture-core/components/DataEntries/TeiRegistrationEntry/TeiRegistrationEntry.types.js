// @flow
import type { RenderFoundation } from '../../../metaData/RenderFoundation';
import type { TeiRegistration } from '../../../metaData/TrackedEntityType/TeiRegistration';

export type OwnProps = $ReadOnly<{|
  id: string,
  teiRegistrationMetadata: ?TeiRegistration,
  selectedScopeId: ?string,
  saveButtonText: string,
  fieldOptions: Object,
  onSave: (dataEntryId: string, itemId: string, formFoundation: RenderFoundation) => void,
  onGetUnsavedAttributeValues: Function,
  onPostProcessErrorMessage: Function,
|}>
