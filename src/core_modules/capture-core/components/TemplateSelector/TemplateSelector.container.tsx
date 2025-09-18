import React from 'react';
import { TemplateSelector as TemplateSelectorComponent } from './TemplateSelector.component';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../utils/routing';
import { useTEITemplates, useProgramStageTemplates } from './hooks';
import type { WorkingListTemplate } from './workingListsBase.types';

export const TemplateSelector = () => {
    const { navigate } = useNavigate();
    const { programId, orgUnitId } = useLocationQuery();
    const { TEITemplates, loading: loadingTEITemplates } = useTEITemplates(programId);
    const { programStageTemplates, loading: loadingProgramStageTemplates } = useProgramStageTemplates(programId);

    const onSelectTemplate = (template: WorkingListTemplate) =>
        navigate(`/?${buildUrlQueryString({ 
            orgUnitId, 
            programId, 
            selectedTemplateId: template.id 
        })}`);

    const onCreateTemplate = () => {
        const urlQueryString = buildUrlQueryString({
            orgUnitId,
            programId,
            selectedTemplateId: `${programId}-default`,
        });
        navigate(`/?${urlQueryString}`);
    };

    return programId && !loadingTEITemplates && !loadingProgramStageTemplates ? (
        <TemplateSelectorComponent
            templates={[...TEITemplates, ...programStageTemplates]}
            onSelectTemplate={onSelectTemplate}
            onCreateTemplate={onCreateTemplate}
        />
    ) : null;
};
