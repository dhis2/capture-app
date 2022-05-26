// @flow
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { TemplateSelector as TemplateSelectorComponent } from './TemplateSelector.component';
import { buildUrlQueryString, useLocationQuery } from '../../../../utils/routing';
import { useTEIFilters } from './useTemplates';

export const TemplateSelector = () => {
    const history = useHistory();
    const { programId, orgUnitId } = useLocationQuery();
    const { TEIFilters } = useTEIFilters(programId);

    const onSelectTemplate = template =>
        history.push(`/?${buildUrlQueryString({ orgUnitId, programId, selectedTemplateId: template.id })}`);
    const onCreateTemplate = () =>
        history.push(`/?${buildUrlQueryString({ orgUnitId, programId, selectedTemplateId: `${programId}-default` })}`);

    return programId ? (
        <TemplateSelectorComponent
            templates={TEIFilters}
            onSelectTemplate={onSelectTemplate}
            onCreateTemplate={onCreateTemplate}
        />
    ) : null;
};
