// @flow
import React, { useCallback } from 'react';
import { Chip, Tooltip } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import type { WorkingListTemplate } from './workingListsBase.types';

type Props = {
    template: WorkingListTemplate,
    onSelectTemplate: (template: WorkingListTemplate) => void,
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
};

const TemplateSelectorChipPlain = (props: Props) => {
    const { template, onSelectTemplate, classes } = props;
    const { displayName } = template;

    const selectTemplateHandler = useCallback(() => {
        onSelectTemplate(template);
    }, [onSelectTemplate, template]);

    const text = displayName.length > 30 ? `${displayName.substring(0, 27)}...` : displayName;

    return (
        <Tooltip
            content={displayName}
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
                        marginTop="0"
                        marginBottom="0"
                        marginLeft="0"
                        marginRight="0"
                        dataTest="workinglist-template-selector-chip"
                        onClick={selectTemplateHandler}
                    >
                        {text}
                    </Chip>
                </button>
            )}
        </Tooltip>
    );
};

export const TemplateSelectorChip = withStyles(styles)(TemplateSelectorChipPlain);
