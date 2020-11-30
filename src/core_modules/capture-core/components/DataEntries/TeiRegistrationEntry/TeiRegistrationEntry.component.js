// @flow
import React, { useEffect, type ComponentType } from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes } from '../../../metaData';
import { startNewTeiDataEntryInitialisation } from './TeiRegistrationEntry.actions';
import { TrackedEntityInstanceDataEntry } from '../TrackedEntityInstance';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import type { OwnProps } from './TeiRegistrationEntry.types';
import { useRegistrationFormInfoForSelectedScope } from '../common/useRegistrationFormInfoForSelectedScope';
import { InfoIconText } from '../../InfoIconText';
import { withSaveHandler } from '../../DataEntry';

const useDataEntryLifecycle = (selectedScopeId, dataEntryId, scopeType) => {
    const dispatch = useDispatch();
    const { id: selectedOrgUnitId } = useCurrentOrgUnitInfo();
    const { formId, formFoundation } = useRegistrationFormInfoForSelectedScope(selectedScopeId);
    const registrationFormReady = !!formId;
    useEffect(() => {
        if (registrationFormReady && scopeType === scopeTypes.TRACKED_ENTITY_TYPE) {
            dispatch(startNewTeiDataEntryInitialisation({ selectedOrgUnitId, selectedScopeId, dataEntryId, formFoundation }));
        }
    }, [scopeType, dataEntryId, selectedScopeId, selectedOrgUnitId, registrationFormReady, formFoundation, dispatch]);
};

const translatedTextWithStyles = (trackedEntityName, orgUnitName) =>
    (<>
        {i18n.t('Saving a {{trackedEntityName}}', { trackedEntityName })} <b>{i18n.t('without')}</b> {i18n.t('enrollment in')} <b>{orgUnitName}</b>. {i18n.t('Enroll in a program by selecting a program from the top bar.')}
    </>);


const styles = ({ typography }) => ({
    marginTop: {
        marginTop: typography.pxToRem(2),
    },
});

const TeiRegistrationEntryPlain =
  ({
      selectedScopeId,
      id,
      onSave,
      classes,
      saveButtonText,
      teiRegistrationMetadata,
      ...rest
  }: { ...OwnProps, ...CssClasses }) => {
      const { scopeType, trackedEntityName } = useScopeInfo(selectedScopeId);
      const { name: orgUnitName } = useCurrentOrgUnitInfo();

      useDataEntryLifecycle(selectedScopeId, id, scopeType);
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
                          {...rest}
                      />
                      {
                          onSave &&
                          <>
                              <Button
                                  dataTest="dhis2-capture-create-and-link-button"
                                  primary
                                  onClick={onSave}
                                  className={classes.marginTop}
                              >
                                  {saveButtonText}
                              </Button>
                              <InfoIconText
                                  text={translatedTextWithStyles(trackedEntityName.toLowerCase(), orgUnitName)}
                              />
                          </>
                      }
                  </>
              }
          </>
      );
  };

export const TeiRegistrationEntry: ComponentType<OwnProps> =
  compose(
      withSaveHandler({ onGetFormFoundation: ({ teiRegistrationMetadata }: OwnProps) => teiRegistrationMetadata.form }),
      withStyles(styles),
  )(TeiRegistrationEntryPlain);
