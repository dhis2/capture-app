// @flow
import React from 'react';
import ViewEvent from './ViewEventComponent/ViewEvent.container';
import ViewEventNewRelationshipWrapper from './Relationship/ViewEventNewRelationshipWrapper.container';
import { LockedSelector } from '../components/LockedSelector/container';

type Props = {
  formInputInProgess: boolean,
  showAddRelationship: boolean,
};

const ViewEventSelector = ({ formInputInProgess, showAddRelationship }: Props) => {
    return (<div>
        <LockedSelector formInputInProgess={formInputInProgess} />

        {
            showAddRelationship ?
                <ViewEventNewRelationshipWrapper /> :
                <ViewEvent />
        }
    </div>);
};

export default ViewEventSelector;
