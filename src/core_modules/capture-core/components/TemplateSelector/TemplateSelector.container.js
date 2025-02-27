// @flow
import React from 'react';
import { useLocationQuery } from '../../utils/routing';
import { useProgramInfo, programTypes } from '../../hooks/useProgramInfo';
import { TEITemplateSelector } from './TEITemplateSelector';
import { EventTemplateSelector } from './EventTemplateSelector';

export const TemplateSelector = () => {
    const { programId } = useLocationQuery();
    const { programType } = useProgramInfo(programId);

    if (!programId) {
        return null;
    }

    // Use the appropriate template selector based on program type
    if (programType === programTypes.EVENT_PROGRAM) {
        return <EventTemplateSelector />;
    }

    return <TEITemplateSelector />;
};
