// @flow
import React from 'react';
import { TemplateSelector as TemplateSelectorComponent } from '../TemplateSelector.component';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { useEventTemplates } from '../hooks';

export const EventTemplateSelector = () => {
    const { navigate } = useNavigate();
    const { programId, orgUnitId } = useLocationQuery();
    const { eventTemplates, loading: loadingEventTemplates } = useEventTemplates(programId);

    const onSelectTemplate = template =>
        navigate(`/?${buildUrlQueryString({ orgUnitId, programId, selectedTemplateId: template.id })}`);
    const onCreateTemplate = () => {
        const urlQueryString = buildUrlQueryString({
            orgUnitId,
            programId,
            selectedTemplateId: `${programId}-default`,
        });
        navigate(`/?${urlQueryString}`);
    };

    return programId && !loadingEventTemplates ? (
        <TemplateSelectorComponent
            templates={eventTemplates}
            onSelectTemplate={onSelectTemplate}
            onCreateTemplate={onCreateTemplate}
        />
    ) : null;
}; 