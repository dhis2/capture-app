// @flow
import * as React from 'react';
import { Chip } from '@dhis2/ui';
import { TemplateSelectorChipContent } from './TemplateSelectorChipContent.component';
import type { WorkingListTemplate } from './workingListsBase.types';
import { TooltipForChip } from '../../Tooltips/TooltipForChip';

type PassOnProps = {
    currentListIsModified: boolean,
};

type Props = {
    ...PassOnProps,
    template: WorkingListTemplate,
    currentTemplateId: string,
    onSelectTemplate: Function,
    maxCharacters?: number,
    disabled?: boolean,
};

export const TemplateSelectorChip = (props: Props) => {
    const {
        template,
        currentTemplateId,
        onSelectTemplate,
        disabled,
        maxCharacters = 30,
        ...passOnProps
    } = props;
    const { name, id } = template;

    const selectTemplateHandler = React.useCallback(() => {
        if (!disabled) {
            onSelectTemplate(template);
        }
    }, [
        disabled,
        onSelectTemplate,
        template,
    ]);

    return (
        <TooltipForChip
            content={name}
            placement={'top'}
            openDelay={800}
            enabled={name.length > maxCharacters}
            onClick={selectTemplateHandler}
        >
            <Chip
                marginTop={0}
                marginBottom={0}
                marginLeft={0}
                marginRight={0}
                dataTest="workinglist-template-selector-chip"
                selected={id === currentTemplateId}
                disabled={disabled}
            >
                <TemplateSelectorChipContent
                    {...passOnProps}
                    text={name}
                    maxCharacters={maxCharacters}
                    isSelectedTemplate={id === currentTemplateId}
                    disabled={disabled}
                />
            </Chip>
        </TooltipForChip>
    );
};

