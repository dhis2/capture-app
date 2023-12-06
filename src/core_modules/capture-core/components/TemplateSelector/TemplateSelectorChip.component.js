// @flow
import React, { useCallback } from 'react';
import { Chip } from '@dhis2/ui';
import type { WorkingListTemplate } from './workingListsBase.types';
import { TooltipForChip } from '../Tooltips/TooltipForChip';

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
        <TooltipForChip
            content={displayName}
            placement={'top'}
            openDelay={800}
            enabled={displayName.length > 30}
            onClick={selectTemplateHandler}
        >
            <Chip
                marginTop={0}
                marginBottom={0}
                marginLeft={0}
                marginRight={0}
                dataTest="workinglist-template-selector-chip"
            >
                {text}
            </Chip>
        </TooltipForChip>

    );
};
