// @flow
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { OwnProps } from './TrackedEntityTypeSelector.types';
import { setTrackedEntityTypeIdOnUrl } from './TrackedEntityTypeSelector.actions';
import { TrackedEntityTypeSelectorComponent } from './TrackedEntityTypeSelector.component';

export const TrackedEntityTypeSelector = ({ onSelect }: OwnProps) => {
    const dispatch = useDispatch();

    const dispatchSetTrackedEntityTypeIdOnUrl = useCallback(
        ({ trackedEntityTypeId }) => { dispatch(setTrackedEntityTypeIdOnUrl({ trackedEntityTypeId })); },
        [dispatch]);

    return (
        <TrackedEntityTypeSelectorComponent
            onSelect={onSelect}
            onSetTrackedEntityTypeIdOnUrl={dispatchSetTrackedEntityTypeIdOnUrl}
        />
    );
};
