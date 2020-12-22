// @flow
import type { RenderFoundation } from '../../../metaData/RenderFoundation';
import type { RegistrationFormMetadata } from '../common/types';

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
