// @flow
import React, { useState, useEffect, useMemo } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import { NoticeBoxes } from './NoticeBoxes.container';
import type { Props } from './dataEntry.types';
import { DataEntry } from '../../DataEntry';
import { getOpenDataEntryActions, getRulesActions } from './actions';
import { useProgramRules } from './hooks';
import { updateFieldBatch, updateDataEntryFieldBatch } from './actions.batchs';
import { buildRules } from './ProgramRules';
import { buildFormFoundation } from './FormFoundation';

export const DataEntryProfile = ({ programAPI, orgUnitId, onCancel, toggleEditModal }: Props) => {
    const { programRules, loading: loadingProgramRules } = useProgramRules(programAPI.id);

    const dataEntryId = 'trackedEntityProfile';
    const itemId = 'edit';
    const dispatch = useDispatch();
    const [program, setProgram] = useState<any>({});
    const [formFoundation, setFormFoundation] = useState<any>({});
    const [startUpdate, setStartUpdate] = useState(false);
    const orgUnit: Object = useMemo(() => ({ id: orgUnitId }), [orgUnitId]);
    const trackedEntityName = useMemo(() => programAPI?.trackedEntityType?.displayName || '', [programAPI]);

    useEffect(() => {
        if (!loadingProgramRules && Object.entries(program).length === 0) {
            buildFormFoundation(programAPI, setFormFoundation);
            buildRules({
                programAPI,
                setProgram,
                programRules,
            });
        }
    }, [programAPI, program, loadingProgramRules, programRules]);

    useEffect(() => {
        if (program && Object.entries(program).length > 0) {
            dispatch(
                batchActions([
                    ...getOpenDataEntryActions(orgUnit, dataEntryId, itemId),
                    ...getRulesActions(program, orgUnit, dataEntryId, itemId),
                ]),
            );
        }
    }, [dispatch, program, orgUnit]);

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
                            formFoundation={formFoundation}
                            onUpdateFormField={(...args: Array<any>) =>
                                dispatch(updateFieldBatch(...args, program, orgUnit))
                            }
                            onUpdateDataEntryField={(...args: Array<any>) =>
                                dispatch(updateDataEntryFieldBatch(...args, program, orgUnit))
                            }
                            onUpdateFormFieldAsync={() => {}}
                            onGetValidationContext={() => {}}
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
