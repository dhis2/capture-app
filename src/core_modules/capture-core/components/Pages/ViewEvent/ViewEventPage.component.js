// @flow
import React from 'react';
import { LockedSelector } from '../../LockedSelector/LockedSelector.container';
import { customOrgUnitIdIdReset, customProgramIdReset } from './ViewEventPage.actions';
import { ViewEvent } from './ViewEventComponent/ViewEvent.container';
import { ViewEventNewRelationshipWrapper } from './Relationship/ViewEventNewRelationshipWrapper.container';

type Props = {
  isUserInteractionInProgress: boolean,
  showAddRelationship: boolean,
};

export const ViewEventPageComponent = ({ isUserInteractionInProgress, showAddRelationship }: Props) => (
    <div>
        <LockedSelector
            isUserInteractionInProgress={isUserInteractionInProgress}
            customActionsOnProgramIdReset={[customOrgUnitIdIdReset()]}
            customActionsOnOrgUnitIdReset={[customProgramIdReset()]}
        />

        {
            showAddRelationship ?
                <ViewEventNewRelationshipWrapper /> :
                <ViewEvent />
        }
    </div>);

