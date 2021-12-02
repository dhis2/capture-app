// @flow
import React, { useState, useMemo } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useDispatch } from 'react-redux';
import { NoticeBoxes } from './NoticeBoxes.container';
import type { Props } from './dataEntry.types';
import { DataEntry } from '../../DataEntry';
import { useLifecycle } from './hooks';
import { getUpdateFieldActions } from './actions';

export const DataEntryProfile = ({ programAPI, orgUnitId, onCancel, toggleEditModal, mergedAttributes }: Props) => {
    const dataEntryId = 'trackedEntityProfile';
    const itemId = 'edit';
    const dispatch = useDispatch();
    const [startUpdate, setStartUpdate] = useState(false);
    const trackedEntityName: string = useMemo(() => programAPI?.trackedEntityType?.displayName || '', [programAPI]);

    const context = useLifecycle({
        programAPI,
        orgUnitId,
        mergedAttributes,
        dataEntryId,
        itemId,
    });

    return (
        <div>
            {toggleEditModal && (
                <Modal large onClose={onCancel} dataTest="modal-edit-profile">
                    <ModalTitle>{i18n.t(`Edit ${trackedEntityName}`)}</ModalTitle>
                    <ModalContent>
                        {i18n.t(
                            'Change information about this {{trackedEntityName}} here. To change information about this enrollment, use the Edit button in the in the Enrollment box on this dashboard',
                            { trackedEntityName, interpolation: { escapeValue: false } },
                        )}
                        <DataEntry
                            id={dataEntryId}
                            formFoundation={context.formFoundation}
                            onUpdateFormField={(...args: Array<any>) =>
                                dispatch(getUpdateFieldActions(context, ...args))
                            }
                            saveAttempted={undefined}
                        />
                        <NoticeBoxes dataEntryId={dataEntryId} itemId={itemId} onComplete={startUpdate} />
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button onClick={onCancel} secondary>
                                {i18n.t('Cancel without saving')}
                            </Button>
                            <Button onClick={() => setStartUpdate(true)} primary>
                                {i18n.t('Save changes')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </div>
    );
};
