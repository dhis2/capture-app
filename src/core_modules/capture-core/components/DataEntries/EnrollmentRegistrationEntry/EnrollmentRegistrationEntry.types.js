// @flow
import type { RenderFoundation } from '../../../metaData/RenderFoundation';
import type { Enrollment } from '../../../metaData/Program/Enrollment';

export type OwnProps = $ReadOnly<{|
  id: string,
  enrollmentMetadata: ?Enrollment,
  selectedScopeId: string,
  saveButtonText: string,
  fieldOptions: Object,
  onSave: (dataEntryId: string, itemId: string, formFoundation: RenderFoundation) => void,
  onPostProcessErrorMessage: Function,
  onGetUnsavedAttributeValues: Function,
  onUpdateField: Function,
  onStartAsyncUpdateField: Function,
|}>
