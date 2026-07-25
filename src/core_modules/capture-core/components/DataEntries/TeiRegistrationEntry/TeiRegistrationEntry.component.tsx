import React, { type ComponentType, useState } from 'react';
import { compose } from 'redux';
import { Button, spacers } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { scopeTypes, useProgramLabel, useStageLabel } from '../../../metaData';
import { TrackedEntityInstanceDataEntry } from '../TrackedEntityInstance';
import { useCurrentOrgUnitId } from '../../../hooks/useCurrentOrgUnitId';
import { useOrgUnitNameWithAncestors } from '../../../metadataRetrieval/orgUnitName';
import type { Props, PlainProps } from './TeiRegistrationEntry.types';
import { DiscardDialog } from '../../Dialogs/DiscardDialog.component';
import { withSaveHandler } from '../../DataEntry';
import { InfoIconText } from '../../InfoIconText';
import { withErrorMessagePostProcessor } from '../withErrorMessagePostProcessor';
import { withDuplicateCheckOnSave } from '../common/TEIAndEnrollment/DuplicateCheckOnSave';
import { getDiscardDialogProps } from '../../Dialogs/DiscardDialog.constants';
import { useMetadataForRegistrationForm } from '../common/TEIAndEnrollment/useMetadataForRegistrationForm';

const TranslatedTextWithStylesForTei = ({
    trackedEntityName,
    orgUnitName,
    hideProgramSelectionMessage,
}: {
    trackedEntityName: string;
    orgUnitName?: string;
    hideProgramSelectionMessage?: boolean;
}) => {
    const enrollment = useProgramLabel('enrollment') ?? i18n.t('enrollment');
    return (<>
        {i18n.t('Saving a {{trackedEntityName}}', {
            trackedEntityName, interpolation: { escapeValue: false } })
        } <b>{i18n.t('without')}</b> {enrollment}
        {orgUnitName && <>{' '}{i18n.t('in')} <b>{orgUnitName}</b></>}.{' '}
        {!hideProgramSelectionMessage && i18n.t('Enroll in a program by selecting a program from the top bar.')}
    </>);
};

const styles: Readonly<any> = {
    actions: {
        display: 'flex',
        gap: spacers.dp8,
    },
};

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
      trackedEntityName,
      isUserInteractionInProgress,
      isSavingInProgress,
      onCancel,
      hideProgramSelectionMessage,
      ...rest
  }: PlainProps & WithStyles<typeof styles>) => {
      const [showWarning, setShowWarning] = useState(false);
      const { scopeType } = useScopeInfo(selectedScopeId);
      const eventLabel = useStageLabel('event') ?? i18n.t('event');
      const { formId, formFoundation } = useMetadataForRegistrationForm({ selectedScopeId });
      const orgUnitId = useCurrentOrgUnitId();
      const { displayName: orgUnitName } = useOrgUnitNameWithAncestors(orgUnitId);

      const handleOnCancel = () => {
          if (!isUserInteractionInProgress) {
              onCancel();
          } else {
              setShowWarning(true);
          }
      };

      return (
          <>
              {
                  scopeType === scopeTypes.TRACKED_ENTITY_TYPE && formId &&
                  <>
                      <TrackedEntityInstanceDataEntry
                          // @ts-expect-error - keeping original functionality as before ts rewrite
                          orgUnitId={orgUnitId}
                          formFoundation={formFoundation}
                          trackedEntityTypeId={selectedScopeId}
                          teiRegistrationMetadata={teiRegistrationMetadata}
                          id={id}
                          fieldOptions={fieldOptions}
                          onPostProcessErrorMessage={onPostProcessErrorMessage}
                          onGetUnsavedAttributeValues={() =>
                              console.log('similar to the withErrorMessagePostProcessor this will come in the future')
                          }
                          {...rest}
                      />
                      <div className={classes.actions}>
                          {
                              onSave &&
                              <Button
                                  dataTest="create-and-link-button"
                                  primary
                                  onClick={onSave}
                                  loading={isSavingInProgress}
                              >
                                  {saveButtonText}
                              </Button>
                          }

                          <Button
                              dataTest="cancel-button"
                              secondary
                              onClick={handleOnCancel}
                              disabled={isSavingInProgress}
                          >
                              {i18n.t('Cancel')}
                          </Button>
                      </div>
                      <InfoIconText>
                          <TranslatedTextWithStylesForTei
                              trackedEntityName={trackedEntityName.toLowerCase()}
                              orgUnitName={orgUnitName}
                              hideProgramSelectionMessage={hideProgramSelectionMessage}
                          />
                      </InfoIconText>

                      <DiscardDialog
                          {...getDiscardDialogProps({ event: eventLabel })}
                          onDestroy={onCancel}
                          open={!!showWarning}
                          onCancel={() => { setShowWarning(false); }}
                      />
                  </>
              }
          </>
      );
  };

export const TeiRegistrationEntryComponent: ComponentType<Props> = compose(
    withErrorMessagePostProcessor((({ trackedEntityName }: any) => trackedEntityName)),
    withDuplicateCheckOnSave(),
    withSaveHandler({ onGetFormFoundation: ({ teiRegistrationMetadata }: any) => {
        const form = teiRegistrationMetadata && teiRegistrationMetadata.form;
        return form;
    } }),
    withStyles(styles),
)(TeiRegistrationEntryPlain) as ComponentType<Props>;
