// @flow
import * as React from 'react';
import { Chip, Tooltip } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/';
import { TemplateSelectorChipContent } from './TemplateSelectorChipContent.component';
import type { WorkingListTemplate } from './workingListsBase.types';

type PassOnProps = {
    currentListIsModified: boolean,
};

type Props = {
    ...PassOnProps,
    template: WorkingListTemplate,
    currentTemplateId: string,
    onSelectTemplate: Function,
    ...CssClasses,
};

const styles = {
    // button style reset
    button: {
        border: 'none',
        backgroundColor: 'transparent',
        borderRadius: '16px',
        padding: 0,
        margin: 0,
        minWidth: 0,
        minHeight: 0,
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    // Override default chip margin
    chip: {
        marginTop: '0 !important',
        marginBottom: '0 !important',
        marginRight: '0 !important',
        marginLeft: '0 !important',
        backgroundColor: 'red',
    },
};

export const TemplateSelectorChipPlain = (props: Props) => {
    const { template, currentTemplateId, onSelectTemplate, classes, ...passOnProps } = props;
    const { name, id } = template;

    const selectTemplateHandler = React.useCallback(() => {
        onSelectTemplate(template);
    }, [
        onSelectTemplate,
        template,
    ]);

    return (
        <Tooltip
            content={name}
            placement={'top'}
            openDelay={800}
        >
            {({ ref, onMouseOver, onMouseOut }) => (
                <button
                    ref={ref}
                    onClick={selectTemplateHandler}
                    className={classes.button}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    onFocus={onMouseOver}
                    onBlur={onMouseOut}
                >
                    <Chip
                        dataTest="workinglist-template-selector-chip"
                        tabIndex="0"
                        className={classes.chip}
                        selected={id === currentTemplateId}
                    >
                        <TemplateSelectorChipContent
                            {...passOnProps}
                            text={name}
                            isSelectedTemplate={id === currentTemplateId}
                        />
                    </Chip>
                </button>
            )}
        </Tooltip>
    );
};

export const TemplateSelectorChip = withStyles(styles)(TemplateSelectorChipPlain);
