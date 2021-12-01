// @flow
import { useDispatch } from 'react-redux';
import React, { useCallback } from 'react';
import type { OwnProps } from './TrackedEntityTypeSelector.types';
import { TrackedEntityTypeSelectorComponent } from './TrackedEntityTypeSelector.component';
import { setTrackedEntityTypeIdOnUrl } from './TrackedEntityTypeSelector.actions';

export const TrackedEntityTypeSelector = ({ onSelect, accessNeeded = 'read', headerText, footerText }: OwnProps) => {
    const dispatch = useDispatch();

    const dispatchSetTrackedEntityTypeIdOnUrl = useCallback(
        ({ trackedEntityTypeId }) => { dispatch(setTrackedEntityTypeIdOnUrl({ trackedEntityTypeId })); },
        [dispatch]);

    return (
        <TrackedEntityTypeSelectorComponent
            accessNeeded={accessNeeded}
            onSelect={onSelect}
            onSetTrackedEntityTypeIdOnUrl={dispatchSetTrackedEntityTypeIdOnUrl}
            headerText={headerText}
            footerText={footerText}
        />
    );
};
