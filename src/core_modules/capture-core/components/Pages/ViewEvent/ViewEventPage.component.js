// @flow
import React from 'react';
import { OrgUnitFetcher } from 'capture-core/components/OrgUnitFetcher';
import { useSelector } from 'react-redux';
import { useLocationQuery } from '../../../utils/routing';
import { ViewEvent } from './ViewEventComponent/ViewEvent.container';
import { ViewEventNewRelationshipWrapper } from './Relationship/ViewEventNewRelationshipWrapper.container';
import { TopBar } from './TopBar';

type Props = {
  isUserInteractionInProgress: boolean,
  showAddRelationship: boolean,
};

export const ViewEventPageComponent = ({ isUserInteractionInProgress, showAddRelationship }: Props) => {
    const { programId, orgUnitId } = useLocationQuery();
    const { selectedCategories } = useSelector(({ currentSelections }) => ({
        selectedCategories: currentSelections.categoriesMeta,
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
