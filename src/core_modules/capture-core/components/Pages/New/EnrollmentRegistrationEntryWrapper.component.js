// @flow
import React, { type ComponentType, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { cleanUpUid } from './NewPage.actions';
import { EnrollmentRegistrationEntry } from '../../DataEntries/EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.container';
import type { OwnProps } from '../../DataEntries/EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.types';
import { RelatedStageModes } from '../../WidgetRelatedStages';

export const EnrollmentRegistrationEntryWrapper: ComponentType<OwnProps> = (props) => {
    const dispatch = useDispatch();
    useEffect(() => () => {
        dispatch(cleanUpUid());
    }, [dispatch]);

    const relatedStageModesOptions = {
        [RelatedStageModes.LINK_EXISTING_RESPONSE]: { hidden: true },
    };

    return <EnrollmentRegistrationEntry {...props} relatedStageModesOptions={relatedStageModesOptions} />;
};
