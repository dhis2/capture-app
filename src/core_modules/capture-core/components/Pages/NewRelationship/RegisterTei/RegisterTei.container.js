// @flow
import React from 'react';
import { useSelector } from 'react-redux';
import { RegisterTeiComponent } from './RegisterTei.component';
import type { OwnProps } from './RegisterTei.types';
import { useScopeInfo } from '../../../../hooks/useScopeInfo';
import { useDuplicates } from '../../../PossibleDuplicatesDialog/useDuplicates';
import { usePossibleDuplicatesExist } from '../../../PossibleDuplicatesDialog/usePossibleDuplicatesExist';

const useNewRelationshipScopeId = (): string =>
    useSelector(
        ({
            newRelationshipRegisterTei: {
                programId,
            },
            newRelationship: {
                selectedRelationshipType: { to: { trackedEntityTypeId } },
            },
        }) => (programId || trackedEntityTypeId),
    );

export const RegisterTei = ({ onLink, onSave, onGetUnsavedAttributeValues }: OwnProps) => {
    const dataEntryId = 'relationship';
    const ready = useSelector(({ newRelationshipRegisterTei }) => (!newRelationshipRegisterTei.loading));
    const error = useSelector(({ newRelationshipRegisterTei }) => (newRelationshipRegisterTei.error));
    const newRelationshipProgramId = useNewRelationshipScopeId();
    const { trackedEntityName } = useScopeInfo(newRelationshipProgramId);
    const { onReviewDuplicates } = useDuplicates(dataEntryId, newRelationshipProgramId);

    return (
        <RegisterTeiComponent
            dataEntryId={dataEntryId}
            onLink={onLink}
            onSave={onSave}
            onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
            onReviewDuplicates={onReviewDuplicates}
            trackedEntityName={trackedEntityName}
            newRelationshipProgramId={newRelationshipProgramId}
            ready={ready}
            error={error}
            possibleDuplicatesExist={usePossibleDuplicatesExist(dataEntryId)}
        />);
};

