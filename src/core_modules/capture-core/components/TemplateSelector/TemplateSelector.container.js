// @flow
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { TemplateSelector as TemplateSelectorComponent } from './TemplateSelector.component';
import { buildUrlQueryString, useLocationQuery } from '../../utils/routing';
import { useTEITemplates, useProgramStageTemplates } from './hooks';

export const TemplateSelector = () => {
    const history = useHistory();
    const { programId, orgUnitId } = useLocationQuery();
    const { TEITemplates, loading: loadingTEITemplates } = useTEITemplates(programId);
    const { programStageTemplates, loading: loadingProgramStageTemplates } = useProgramStageTemplates(programId);

    const onSelectTemplate = template =>
        history.push(`/?${buildUrlQueryString({ orgUnitId, programId, selectedTemplateId: template.id })}`);
    const onCreateTemplate = () =>
        history.push(`/?${buildUrlQueryString({ orgUnitId, programId, selectedTemplateId: `${programId}-default` })}`);

    return programId && !loadingTEITemplates && !loadingProgramStageTemplates ? (
        <TemplateSelectorComponent
            templates={[...TEITemplates, ...programStageTemplates]}
            onSelectTemplate={onSelectTemplate}
            onCreateTemplate={onCreateTemplate}
        />
    ) : null;
};
