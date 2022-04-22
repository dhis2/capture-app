// @flow
import React, { useMemo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, spacersNum } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { localeCompareStrings } from '../../utils/localeCompareStrings';
import { TemplateSelectorChip } from './TemplateSelectorChip.component';
import type { WorkingListTemplates, WorkingListTemplate } from './workingListsBase.types';

const getStyles = (theme: Theme) => ({
    configsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: `${theme.typography.pxToRem(3)} 0rem`,
        overflow: 'hidden',
    },
    chipContainer: {
        padding: `${theme.typography.pxToRem(5)} ${theme.typography.pxToRem(8)}`,
    },
    container: {
        margin: `${spacersNum.dp16}px`,
    },
});

type Props = {
    templates: WorkingListTemplates,
    onSelectTemplate: (template: WorkingListTemplate) => void,
    onCreateTemplate: () => void,
    classes: Object,
};

const TemplateSelectorPlain = (props: Props) => {
    const { templates, onSelectTemplate, onCreateTemplate, classes } = props;

    const customTemplates = useMemo(
        () =>
            templates.sort(({ sortOrder: orderA, displayName: nameA }, { sortOrder: orderB, displayName: nameB }) => {
                let sortResult;
                if (orderA && orderB) {
                    sortResult = orderA - orderB;
                } else if (orderA) {
                    sortResult = 1;
                } else if (orderB) {
                    sortResult = -1;
                } else {
                    sortResult = localeCompareStrings(nameA, nameB);
                }
                return sortResult;
            }),
        [templates],
    );

    const configElements = customTemplates.map((customTemplate) => {
        const { id } = customTemplate;
        return (
            <div className={classes.chipContainer} key={id}>
                <TemplateSelectorChip template={customTemplate} onSelectTemplate={onSelectTemplate} />
            </div>
        );
    });

    return (
        <div className={classes.container}>
            {i18n.t('Saved lists in this program')}
            {customTemplates.length > 0 ? (
                <div className={classes.configsContainer}>{configElements}</div>
            ) : (
                <p>{i18n.t('None')}</p>
            )}
            <Button onClick={onCreateTemplate} color="secondary">
                {i18n.t('Create custom working list')}
            </Button>
        </div>
    );
};

export const TemplateSelector = withStyles(getStyles)(TemplateSelectorPlain);
