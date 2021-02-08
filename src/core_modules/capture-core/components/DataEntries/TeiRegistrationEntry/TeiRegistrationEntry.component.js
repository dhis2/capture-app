// @flow
import React, { type ComponentType } from 'react';
import { compose } from 'redux';
import { Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { TrackedEntityInstanceDataEntry } from '../TrackedEntityInstance';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import type { HOCProps, Props } from './TeiRegistrationEntry.types';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import { withSaveHandler } from '../../DataEntry';
import { InfoIconText } from '../../InfoIconText';
import withErrorMessagePostProcessor from '../withErrorMessagePostProcessor/withErrorMessagePostProcessor';

const translatedTextWithStylesForTei = (trackedEntityName, orgUnitName) =>
    (<>
        {i18n.t('Saving a {{trackedEntityName}}', { trackedEntityName })} <b>{i18n.t('without')}</b> {i18n.t('enrollment')}
        {orgUnitName && <>{' '}{i18n.t('in')} <b>{orgUnitName}</b></>}.{' '}
        {i18n.t('Enroll in a program by selecting a program from the top bar.')}
    </>);

const styles = ({ typography }) => ({
    marginTop: {
        marginTop: typography.pxToRem(2),
    },
});

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
      ...rest
  }: Props) => {
      const { scopeType, trackedEntityName } = useScopeInfo(selectedScopeId);
      const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
      const orgUnit = useCurrentOrgUnitInfo();

      return (
          <>
              {
                  scopeType === scopeTypes.TRACKED_ENTITY_TYPE && formId &&
                  <>
                      {/* $FlowFixMe */}
                      <TrackedEntityInstanceDataEntry
                          orgUnit={orgUnit}
                          formFoundation={formFoundation}
                          programId={selectedScopeId}
                          teiRegistrationMetadata={teiRegistrationMetadata}
                          id={id}
                          fieldOptions={fieldOptions}
                          onPostProcessErrorMessage={onPostProcessErrorMessage}
                          onGetUnsavedAttributeValues={() => console.log('similar to the withErrorMessagePostProcessor this will come in the future')}
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

                      <InfoIconText>
                          {translatedTextWithStylesForTei(trackedEntityName.toLowerCase(), orgUnit.name)}
                      </InfoIconText>

                  </>
              }
          </>
      );
  };

export const TeiRegistrationEntryComponent: ComponentType<$Diff<Props, HOCProps>> =
  compose(
      withErrorMessagePostProcessor(),
      withSaveHandler({ onGetFormFoundation: ({ teiRegistrationMetadata }) => {
          const form = teiRegistrationMetadata && teiRegistrationMetadata.form;
          return form;
      } }),
      withStyles(styles),
  )(TeiRegistrationEntryPlain);
