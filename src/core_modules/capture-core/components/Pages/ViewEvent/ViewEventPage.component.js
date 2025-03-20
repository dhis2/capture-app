// @flow
import React, { useEffect } from 'react';
import { OrgUnitFetcher } from 'capture-core/components/OrgUnitFetcher';
import { useSelector } from 'react-redux';
import { ViewEvent } from './ViewEventComponent/ViewEvent.container';
import { ViewEventNewRelationshipWrapper } from './Relationship/ViewEventNewRelationshipWrapper.container';
import { TopBar } from './TopBar.container';
import { inMemoryFileStore } from '../../DataEntry/file/inMemoryFileStore';
import { useLocationQuery } from '../../../utils/routing';

type Props = {
  isUserInteractionInProgress: boolean,
  showAddRelationship: boolean,
};

export const ViewEventPageComponent = ({ isUserInteractionInProgress, showAddRelationship }: Props) => {
    useEffect(() => inMemoryFileStore.clear, []);
    const { orgUnitId } = useLocationQuery();
    const { selectedCategories, programId } = useSelector(({ currentSelections }) => ({
        selectedCategories: currentSelections.categoriesMeta,
        programId: currentSelections.programId,
    }));

    return (
        <OrgUnitFetcher orgUnitId={orgUnitId}>
            <TopBar
                programId={programId}
                orgUnitId={orgUnitId}
                selectedCategories={selectedCategories}
                isUserInteractionInProgress={isUserInteractionInProgress}
                formIsOpen
            />
            {
                showAddRelationship ?
                    <ViewEventNewRelationshipWrapper /> :
                    <ViewEvent
                        programId={programId}
                    />
            }
        </OrgUnitFetcher>
    );
};
