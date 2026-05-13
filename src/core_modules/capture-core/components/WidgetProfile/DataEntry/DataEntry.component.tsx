import React from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { NoticeBoxes } from './NoticeBoxes.container';
import type { PlainProps } from './dataEntry.types';
import { DataEntry } from '../../DataEntry';
import { ReadOnlyBadge } from '../../ReadOnlyBadge';
import { TEI_MODAL_STATE } from './dataEntry.actions';

const styles = {
    title: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: `${spacersNum.dp8}px`,
    },
};

const DataEntryComponentPlain = ({
    classes,
    dataEntryId,
    onCancel,
    onSave,
    saveAttempted,
    onUpdateFormField,
    onUpdateFormFieldAsync,
    trackedEntityName,
    formFoundation,
    modalState,
    onGetValidationContext,
    errorsMessages,
    warningsMessages,
    orgUnitId,
    pluginContext,
    readOnly,
    accessReadOnly,
}: PlainProps & WithStyles<typeof styles>) => (
    <Modal large onClose={onCancel} dataTest="modal-edit-profile">
        <ModalTitle>
            <div className={classes.title}>
                <span>
                    {readOnly
                        ? i18n.t(
                            '{{trackedEntityName}} profile',
                            { trackedEntityName, interpolation: { escapeValue: false } },
                        )
                        : i18n.t('Edit {{trackedEntityName}}', { trackedEntityName, interpolation: { escapeValue: false } })
                    }
                </span>
                <ReadOnlyBadge
                    trackedEntityTypeWriteAccess={!accessReadOnly}
                    trackedEntityName={trackedEntityName}
                    inlineLabel
                />
            </div>
        </ModalTitle>
        <ModalContent>
            {!readOnly && (
                <>
                    {i18n.t(
                        'Change information about this {{trackedEntityName}} here.',
                        { trackedEntityName, interpolation: { escapeValue: false } },
                    )}
                    {' '}
                    {i18n.t('Information about this enrollment can be edited in the Enrollment widget.')}
                </>
            )}
            <DataEntry
                id={dataEntryId}
                formFoundation={formFoundation}
                saveAttempted={saveAttempted}
                onUpdateFormField={onUpdateFormField}
                onUpdateFormFieldAsync={onUpdateFormFieldAsync}
                onGetValidationContext={onGetValidationContext}
                orgUnitId={orgUnitId}
                pluginContext={pluginContext}
                viewMode={readOnly}
            />
            {!readOnly && (
                <NoticeBoxes
                    errorsMessages={errorsMessages}
                    warningsMessages={warningsMessages}
                    hasApiError={modalState === TEI_MODAL_STATE.OPEN_ERROR}
                />
            )}
        </ModalContent>
        <ModalActions>
            <ButtonStrip end>
                <Button onClick={onCancel} secondary>
                    {readOnly ? i18n.t('Close') : i18n.t('Cancel without saving')}
                </Button>
                {!readOnly && modalState === TEI_MODAL_STATE.OPEN_DISABLE && (
                    <Button loading primary>
                        {i18n.t('Loading...')}
                    </Button>
                )}
                {!readOnly && (modalState === TEI_MODAL_STATE.OPEN || modalState === TEI_MODAL_STATE.OPEN_ERROR) && (
                    <Button onClick={onSave} primary>
                        {i18n.t('Save changes')}
                    </Button>
                )}
            </ButtonStrip>
        </ModalActions>
    </Modal>
);

export const DataEntryComponent = withStyles(styles)(DataEntryComponentPlain);
