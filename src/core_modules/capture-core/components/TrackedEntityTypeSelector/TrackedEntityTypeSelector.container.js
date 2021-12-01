// @flow
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setTrackedEntityTypeIdOnUrl } from './TrackedEntityTypeSelector.actions';
import { TrackedEntityTypeSelectorComponent } from './TrackedEntityTypeSelector.component';
import type { OwnProps } from './TrackedEntityTypeSelector.types';

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
