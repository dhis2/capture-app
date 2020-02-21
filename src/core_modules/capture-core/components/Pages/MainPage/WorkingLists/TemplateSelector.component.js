// @flow
import * as React from 'react';
import { fade, lighten } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core';
import { Chip } from '@dhis2/ui-core';
import type { WorkingListTemplate } from './workingLists.types';

const getBorder = (theme: Theme) => {
    const color = lighten(fade(theme.palette.divider, 1), 0.88);
    return `${theme.typography.pxToRem(1)} solid ${color}`;
};

const getStyles = (theme: Theme) => ({
    configsContainer: {
        borderBottom: getBorder(theme),
        display: 'flex',
        flexWrap: 'wrap',
        padding: `${theme.typography.pxToRem(3)} 0rem`,
    },
    chipContainer: {
        padding: `${theme.typography.pxToRem(5)} ${theme.typography.pxToRem(8)}`,
    },
    chip: {
    },
    chipSelected: {
        color: 'white',
        backgroundColor: theme.palette.secondary.main,
        '&:focus': {
            backgroundColor: theme.palette.secondary.main,
        },
    },
});

type Props = {
    templates: Array<WorkingListTemplate>,
    currentTemplateId: ?string,
    onSelectTemplate: Function,
    classes: Object,
};

const TemplateSelector = (props: Props) => {
    const { templates, currentTemplateId, onSelectTemplate, classes } = props;

    const customTemplates = templates
        .filter(c => !c.isDefault);

    if (customTemplates.length <= 0) {
        return null;
    }

    const configElements = customTemplates.map((customTemplate) => {
        const { id, name } = customTemplate;
        return (
            <div
                className={classes.chipContainer}
                key={id}
            >
                <Chip
                    dataTest="workinglist-template-selector-chip"
                    selected={id === currentTemplateId}
                    onClick={() => onSelectTemplate(customTemplate)}
                >
                    {name}
                </Chip>
            </div>
        );
    });

    return (
        <div
            className={classes.configsContainer}
        >
            {configElements}
        </div>
    );
};

export default withStyles(getStyles)(TemplateSelector);
