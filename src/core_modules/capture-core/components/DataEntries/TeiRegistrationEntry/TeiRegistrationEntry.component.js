// @flow
import React from 'react';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { TrackedEntityInstanceDataEntry } from '../TrackedEntityInstance';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import type { OwnProps } from './TeiRegistrationEntry.types';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import { withSaveHandler } from '../../DataEntry';


const styles = ({ typography }) => ({
    marginTop: {
        marginTop: typography.pxToRem(2),
    },
});
export const TeiRegistrationEntryComponent = ({ selectedScopeId, id, ...rest }: OwnProps) => {
    const { scopeType } = useScopeInfo(selectedScopeId);
    const { formId, registrationMetaData, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const orgUnit = useCurrentOrgUnitInfo();

const TeiRegistrationEntryPlain =
  ({
      id,
      selectedScopeId,
      onSave,
      saveButtonText,
      teiRegistrationMetadata,
      fieldOptions,
      classes,
      onPostProcessErrorMessage,
      onGetUnsavedAttributeValues,
      ...rest
  }: { ...OwnProps, ...CssClasses }) => {
      const { scopeType } = useScopeInfo(selectedScopeId);

      useDataEntryLifecycle(selectedScopeId, id, scopeType);
      const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
      const orgUnit = useCurrentOrgUnitInfo();

      return (
          <>
              {
                  scopeType === scopeTypes.TRACKED_ENTITY_TYPE && formId &&
                  <>
                      <TrackedEntityInstanceDataEntry
                          orgUnit={orgUnit}
                          formFoundation={formFoundation}
                          programId={selectedScopeId}
                          teiRegistrationMetadata={teiRegistrationMetadata}
                          id={id}
                          fieldOptions={fieldOptions}
                          onPostProcessErrorMessage={onPostProcessErrorMessage}
                          onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
                          {...rest}
                      />
                      {
                          onSave &&
                          <Button
                              dataTest="dhis2-capture-create-and-link-button"
                              primary
                              onClick={onSave}
                              className={classes.marginTop}
                          >
                              {saveButtonText}
                          </Button>
                      }
                  </>
              }
          </>
      );
  };

export const TeiRegistrationEntry: ComponentType<OwnProps> =
  compose(
      withSaveHandler({ onGetFormFoundation: ({ teiRegistrationMetadata }) => {
          const form = teiRegistrationMetadata && teiRegistrationMetadata.form;
          debugger;
          return form;
      } }),
      withStyles(styles),
  )(TeiRegistrationEntryPlain);
