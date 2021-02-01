// @flow
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { OwnProps } from './TrackedEntityTypeSelector.types';
import { setTrackedEntityTypeIdOnUrl } from './TrackedEntityTypeSelector.actions';
import { TrackedEntityTypeSelectorComponent } from './TrackedEntityTypeSelector.component';

export const TrackedEntityTypeSelector = ({ onSelect, accessNeeded = 'read' }: OwnProps) => {
    const dispatch = useDispatch();

    const dispatchSetTrackedEntityTypeIdOnUrl = useCallback(
        ({ trackedEntityTypeId }) => { dispatch(setTrackedEntityTypeIdOnUrl({ trackedEntityTypeId })); },
        [dispatch]);

    return (
        <TrackedEntityTypeSelectorComponent
            accessNeeded={accessNeeded}
            onSelect={onSelect}
            onSetTrackedEntityTypeIdOnUrl={dispatchSetTrackedEntityTypeIdOnUrl}
        />
    );
};
