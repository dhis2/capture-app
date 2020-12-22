// @flow
import type { RegistrationFormMetadata } from '../common/types';
import type { RenderFoundation } from '../../../metaData/RenderFoundation';

export type OwnProps = $ReadOnly<{|
  id: string,
  teiRegistrationMetadata: RegistrationFormMetadata,
  selectedScopeId: string,
  saveButtonText: string,
  fieldOptions?: Object,
  onSave: (dataEntryId: string, itemId: string, formFoundation: RenderFoundation) => void,
  onGetUnsavedAttributeValues: Function,
  onPostProcessErrorMessage: Function,
|}>
