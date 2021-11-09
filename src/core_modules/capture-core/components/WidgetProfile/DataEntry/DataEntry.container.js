// @flow
import React, { useState, useEffect, useMemo } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import type { Props } from './dataEntry.types';
import { DataEntry } from '../../DataEntry';
import { getOpenDataEntryActions, getRulesActions } from './actions';
import { enrollmentUpdateFieldBatch, enrollmentUpdateDataEntryFieldBatch } from '../../DataEntries';
import { buildForm } from './buildForm';

export const DataEntryProfile = ({ programAPI, orgUnitId, onCancel, toggleEditModal }: Props) => {
    const dataEntryId = 'trackedEntityProfile';
    const itemId = 'edit';
    const dispatch = useDispatch();
    const orgUnit: Object = useMemo(() => ({ id: orgUnitId }), [orgUnitId]);
    const [enrollment, setEnrollment] = useState<any>({});
    const trackedEntityName = useMemo(() => programAPI?.trackedEntityType?.displayName || '', [programAPI]);

    useEffect(() => {
        if (Object.entries(enrollment).length === 0) {
            const trackedEntityTypes = [programAPI.trackedEntityType];
            const trackedEntityAttributes = programAPI.programTrackedEntityAttributes.reduce(
                (acc, currentValue) => [...acc, currentValue.trackedEntityAttribute],
                [],
            );
            const optionSets = trackedEntityAttributes.reduce(
                (acc, currentValue) => (currentValue.optionSet ? [...acc, currentValue.optionSet] : acc),
                [],
            );

            buildForm(trackedEntityAttributes, optionSets, trackedEntityTypes, programAPI, setEnrollment);
        }
    }, [programAPI, enrollment]);

    useEffect(() => {
        if (enrollment && Object.entries(enrollment).length > 0) {
            dispatch(
                batchActions([
                    ...getOpenDataEntryActions(orgUnit, dataEntryId, itemId),
                    ...getRulesActions(enrollment.enrollmentForm, orgUnit, dataEntryId, itemId),
                ]),
            );
        }
    }, [dispatch, enrollment, orgUnit]);

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
                            formFoundation={enrollment?.enrollmentForm}
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
                            {/* TODO - https://jira.dhis2.org/browse/DHIS2-10950 */}
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
