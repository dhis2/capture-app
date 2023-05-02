// @flow
import React from 'react';
import { NewTrackedEntityRelationship } from '../../WidgetTrackedEntityRelationship/NewTrackedEntityRelationship';
import type { Props } from './AddNewRelationship.types';

export const AddNewRelationship = ({ eventId, teiId, ...passOnProps }: Props) => {
    if (teiId) {
        return (
            <NewTrackedEntityRelationship
                teiId={teiId}
                {...passOnProps}
            />
        );
    }

    if (eventId) {
        return (
            <div>
                <h3>Event based relationship</h3>
                <p>Event based relationships are not supported yet</p>
            </div>
        );
    }

    return null;
};
