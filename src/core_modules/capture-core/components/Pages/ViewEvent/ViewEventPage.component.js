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
  isReadOnly: boolean,
};

export const ViewEventPageComponent = ({ isUserInteractionInProgress, showAddRelationship, isReadOnly }: Props) => {
    useEffect(() => inMemoryFileStore.clear, []);
    const { orgUnitId } = useLocationQuery();

    const { selectedCategories, programId } = useSelector(({ currentSelections }) => ({
        selectedCategories: currentSelections.categoriesMeta,
        programId: currentSelections.programId,
    }));

    console.log('test orgUnitId view event page', orgUnitId);
    return (
        <OrgUnitFetcher orgUnitId={orgUnitId}>
            <TopBar
                programId={programId}
                orgUnitId={orgUnitId}
                selectedCategories={selectedCategories}
                isReadOnly={isReadOnly}
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
