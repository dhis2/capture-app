// @flow
import React, { useState, useEffect, useMemo } from 'react';
import { Modal, ModalTitle, ModalContent, ModalActions, ButtonStrip, Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { useDispatch, useSelector } from 'react-redux';

import type {
    OrgUnit,
    TrackedEntityAttributes,
    OptionSets,
    ProgramRulesContainer,
} from 'capture-core-utils/rulesEngine';
import { NoticeBoxes } from './NoticeBoxes.container';
import type { Props } from './dataEntry.types';
import { DataEntry } from '../../DataEntry';
import { useProgramRules, useConstants } from './hooks';
import { getUpdateFieldActions, getOpenDataEntryActions } from './actions';
import { buildRulesContainer } from './ProgramRules';
import { buildFormFoundation } from './FormFoundation';

export const DataEntryProfile = ({ programAPI, orgUnitId, onCancel, toggleEditModal }: Props) => {
    // TODO: Getting the entire state object is bad and this needs to be refactored.
    // The problem is the helper methods that take the entire state object.
    // Refactor the helper methods (getCurrentClientValues, getCurrentClientMainData in rules/actionsCreator) to be more explicit with the arguments.
    const state = useSelector(stateArg => stateArg);

    const dataEntryId = 'trackedEntityProfile';
    const itemId = 'edit';
    const { programRules, loading: loadingProgramRules } = useProgramRules(programAPI.id);
    const { constants } = useConstants();
    const dispatch = useDispatch();
    const [rulesContainer, setRulesContainer] = useState<ProgramRulesContainer>({});
    const [formFoundation, setFormFoundation] = useState<any>({});
    const [startUpdate, setStartUpdate] = useState(false);

    const orgUnit: OrgUnit = useMemo(() => ({ id: orgUnitId, name: '' }), [orgUnitId]); // TODO org unit name
    const trackedEntityName: string = useMemo(() => programAPI?.trackedEntityType?.displayName || '', [programAPI]);
    const trackedEntityAttributes: TrackedEntityAttributes = useMemo(
        () =>
            programAPI?.programTrackedEntityAttributes?.reduce(
                (acc, currentValue) => ({
                    ...acc,
                    [currentValue.trackedEntityAttribute.id]: currentValue.trackedEntityAttribute,
                }),
                {},
            ),
        [programAPI],
    );
    const optionSets: OptionSets = useMemo(
        () =>
            Object.values(trackedEntityAttributes)?.reduce(
                (acc, currentValue) =>
                    // $FlowFixMe[incompatible-type]
                    (currentValue.optionSet ? { ...acc, [currentValue.optionSet.id]: currentValue.optionSet } : acc),
                {},
            ),
        [trackedEntityAttributes],
    );

    useEffect(() => {
        if (!loadingProgramRules && constants && Object.entries(formFoundation).length === 0) {
            buildFormFoundation(programAPI, setFormFoundation);
            buildRulesContainer({
                programAPI,
                setRulesContainer,
                programRules,
                constants,
            });
        }
    }, [programAPI, loadingProgramRules, programRules, formFoundation, constants]);

    useEffect(() => {
        if (
            rulesContainer &&
            Object.entries(rulesContainer).length > 0 &&
            formFoundation &&
            Object.entries(formFoundation).length > 0
        ) {
            dispatch(
                getOpenDataEntryActions({
                    orgUnit,
                    dataEntryId,
                    itemId,
                    foundation: formFoundation,
                    trackedEntityAttributes,
                    optionSets,
                    rulesContainer,
                }),
            );
        }
    }, [dispatch, orgUnit, formFoundation, trackedEntityAttributes, optionSets, rulesContainer]);

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
                            onUpdateFormField={(...args: Array<any>) => {
                                const context = {
                                    orgUnit,
                                    trackedEntityAttributes,
                                    optionSets,
                                    rulesContainer,
                                    formFoundation,
                                    state,
                                };
                                return dispatch(getUpdateFieldActions(context, ...args));
                            }}
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
