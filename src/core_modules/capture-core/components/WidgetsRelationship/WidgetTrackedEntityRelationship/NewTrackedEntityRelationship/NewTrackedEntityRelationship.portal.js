// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { NewTrackedEntityRelationshipComponent } from './NewTrackedEntityRelationship.component';
import type { PortalProps } from './NewTrackedEntityRelationship.types';

export const NewTrackedEntityRelationshipPortal = ({ renderElement, ...passOnProps }: PortalProps) =>
    ReactDOM.createPortal((
        <NewTrackedEntityRelationshipComponent {...passOnProps} />
    ), renderElement);
