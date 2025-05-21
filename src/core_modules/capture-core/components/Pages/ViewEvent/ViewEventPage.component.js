// @flow
import React, { useEffect } from 'react';
import { OrgUnitFetcher } from 'capture-core/components/OrgUnitFetcher';
import { useSelector } from 'react-redux';
import { ViewEvent } from './ViewEventComponent/ViewEvent.container';
import { ViewEventNewRelationshipWrapper } from './Relationship/ViewEventNewRelationshipWrapper.container';
import { TopBar } from './TopBar.container';
import { inMemoryFileStore } from '../../DataEntry/file/inMemoryFileStore';

type Props = {
    isUserInteractionInProgress: boolean,
    eventDetailsSection: Object,
    showAddRelationship: boolean,
    orgUnitId: string,
};

export const ViewEventPageComponent = ({
    isUserInteractionInProgress,
    eventDetailsSection,
    showAddRelationship,
    orgUnitId,
}: Props) => {
    useEffect(() => inMemoryFileStore.clear, []);
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
                editEventMode={eventDetailsSection.showEditEvent}
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
