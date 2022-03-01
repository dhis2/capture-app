// @flow
import React from 'react';
import { OrgUnitFetcher } from 'capture-core/components/OrgUnitFetcher';
import { useSelector } from 'react-redux';
import { ViewEvent } from './ViewEventComponent/ViewEvent.container';
import { ViewEventNewRelationshipWrapper } from './Relationship/ViewEventNewRelationshipWrapper.container';
import { LockedSelector } from '../../LockedSelector/LockedSelector.container';
import { customOrgUnitIdIdReset, customProgramIdReset } from './ViewEventPage.actions';

type Props = {
  isUserInteractionInProgress: boolean,
  showAddRelationship: boolean,
};

export const ViewEventPageComponent = ({ isUserInteractionInProgress, showAddRelationship }: Props) => {
    const orgUnitId = useSelector(({ currentSelections }) => currentSelections.orgUnitId);

    return (<div>
        <LockedSelector
            isUserInteractionInProgress={isUserInteractionInProgress}
            customActionsOnProgramIdReset={[customProgramIdReset()]}
            customActionsOnOrgUnitIdReset={[customOrgUnitIdIdReset()]}
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
