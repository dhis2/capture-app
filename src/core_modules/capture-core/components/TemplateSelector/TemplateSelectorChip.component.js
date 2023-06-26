// @flow
import React, { useCallback } from 'react';
import { Chip } from '@dhis2/ui';
import type { WorkingListTemplate } from './workingListsBase.types';

type Props = {
    template: WorkingListTemplate,
    onSelectTemplate: (template: WorkingListTemplate) => void,
};

export const TemplateSelectorChip = (props: Props) => {
    const { template, onSelectTemplate } = props;
    const { displayName } = template;

    const selectTemplateHandler = useCallback(() => {
        onSelectTemplate(template);
    }, [onSelectTemplate, template]);

    const text = displayName.length > 30 ? `${displayName.substring(0, 27)}...` : displayName;

    return (
        <Chip marginTop="0" marginBottom="0" marginLeft="0" marginRight="0" dataTest="workinglist-template-selector-chip" onClick={selectTemplateHandler}>
            {text}
        </Chip>
    );
};
