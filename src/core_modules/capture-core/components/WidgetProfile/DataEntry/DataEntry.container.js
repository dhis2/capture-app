// @flow
import React, { useState, useEffect, useMemo } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import type { Props } from './dataEntry.types';
import { DataEntry } from '../../DataEntry';
import { useTrackedEntityTypes, useTrackedEntityAttributes, useOptionSets } from './hooks';
import { getOpenDataEntryActions } from './getOpenDataEntryActions';
import { enrollmentUpdateFieldBatch, enrollmentUpdateDataEntryFieldBatch } from '../../DataEntries';
import { buildForm } from './buildForm';

export const DataEntryProfile = ({ programAPI, orgUnitId, trackedEntityType, onCancel, toggleEditModal }: Props) => {
    const { trackedEntityTypes, loading: loadingTrackedEntityTypes } = useTrackedEntityTypes();
    const { trackedEntityAttributes, loading: loadingTrackedEntityAttributes } = useTrackedEntityAttributes();
    const { optionSets, loading: loadingOptionSets } = useOptionSets();
    const dataEntryId = 'trackedEntityProfile';
    const itemId = 'edit';
    const dispatch = useDispatch();
    const orgUnit: Object = useMemo(() => ({ id: orgUnitId }), [orgUnitId]);
    const [program, setProgram] = useState<any>({});
    const trackedEntityName = useMemo(
        () =>
            (!loadingTrackedEntityTypes &&
                trackedEntityTypes?.find(item => item.id === trackedEntityType)?.displayName) ||
            '',
        [loadingTrackedEntityTypes, trackedEntityTypes, trackedEntityType],
    );

    useEffect(() => {
        if (
            !loadingTrackedEntityTypes &&
            !loadingTrackedEntityAttributes &&
            !loadingOptionSets &&
            Object.entries(program).length === 0
        ) {
            buildForm(trackedEntityAttributes, optionSets, trackedEntityTypes, programAPI, setProgram);
        }
    }, [
        programAPI,
        program,
        loadingTrackedEntityAttributes,
        loadingTrackedEntityTypes,
        loadingOptionSets,
        trackedEntityTypes,
        trackedEntityAttributes,
        optionSets,
    ]);

    useEffect(() => {
        if (program && Object.entries(program).length > 0) {
            dispatch(
                batchActions([
                    ...getOpenDataEntryActions(
                        program,
                        program.enrollment.enrollmentForm,
                        orgUnit,
                        dataEntryId,
                        itemId,
                    ),
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
                            { trackedEntityName },
                        )}
                        <DataEntry
                            id={dataEntryId}
                            formFoundation={program?.enrollment?.enrollmentForm}
                            onUpdateFormField={(...args: Array<any>) =>
                                dispatch(enrollmentUpdateFieldBatch(...args, programAPI.id, orgUnit))
                            }
                            onUpdateDataEntryField={(...args: Array<any>) =>
                                dispatch(enrollmentUpdateDataEntryFieldBatch(...args, programAPI.id, orgUnit))
                            }
                            onUpdateFormFieldAsync={() => {}}
                            onGetValidationContext={() => {}}
                            saveAttempted={undefined}
                        />
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button onClick={onCancel} secondary>
                                {i18n.t('Cancel without saving')}
                            </Button>
                            <Button onClick={() => {}} primary>
                                {i18n.t('Save changes')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </div>
    );
};
