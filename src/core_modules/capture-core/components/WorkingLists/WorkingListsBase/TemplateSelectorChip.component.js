// @flow
import * as React from 'react';
import { Chip } from '@dhis2/ui';
import { TemplateSelectorChipContent } from './TemplateSelectorChipContent.component';
import type { WorkingListTemplate } from './workingListsBase.types';
import { ConditionalTooltipForChip } from '../../ConditionalTooltipForChip';

type PassOnProps = {
    currentListIsModified: boolean,
};

type Props = {
    ...PassOnProps,
    template: WorkingListTemplate,
    currentTemplateId: string,
    onSelectTemplate: Function,
};

export const TemplateSelectorChip = (props: Props) => {
    const { template, currentTemplateId, onSelectTemplate, ...passOnProps } = props;
    const { name, id } = template;

    const selectTemplateHandler = React.useCallback(() => {
        onSelectTemplate(template);
    }, [
        onSelectTemplate,
        template,
    ]);

    return (
        <ConditionalTooltipForChip
            content={name}
            placement={'top'}
            openDelay={800}
            enabled={name.length > 30}
            onClick={selectTemplateHandler}
        >
            <Chip
                marginTop="0"
                marginBottom="0"
                marginLeft="0"
                marginRight="0"
                dataTest="workinglist-template-selector-chip"
                selected={id === currentTemplateId}
            >
                <TemplateSelectorChipContent
                    {...passOnProps}
                    text={name}
                    isSelectedTemplate={id === currentTemplateId}
                />
            </Chip>
        </ConditionalTooltipForChip>
    );
};

