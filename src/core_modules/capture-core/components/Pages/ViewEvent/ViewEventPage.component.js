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
  showAddRelationship: boolean,
};

export const ViewEventPageComponent = ({ isUserInteractionInProgress, showAddRelationship }: Props) => {
    useEffect(() => inMemoryFileStore.clear, []);

    const { selectedCategories, programId, orgUnitId } = useSelector(({ currentSelections }) => ({
        selectedCategories: currentSelections.categoriesMeta,
        programId: currentSelections.programId,
        orgUnitId: currentSelections.orgUnitId,
    }));

    return (<div>
        <TopBar
            programId={programId}
            orgUnitId={orgUnitId}
            selectedCategories={selectedCategories}
            isUserInteractionInProgress={isUserInteractionInProgress}
        />
        <OrgUnitFetcher orgUnitId={orgUnitId}>
            {
                showAddRelationship ?
                    <ViewEventNewRelationshipWrapper /> :
                    <ViewEvent />
            }
        </OrgUnitFetcher>
    </div>);
};
