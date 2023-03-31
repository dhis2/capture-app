// @flow
import React, { useMemo, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import cx from 'classnames';
import { Button, spacersNum, colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { localeCompareStrings } from '../../../utils/localeCompareStrings';
import { TemplateSelectorChip } from './TemplateSelectorChip.component';
import type { WorkingListTemplates, WorkingListTemplate } from './workingListsBase.types';
import { Widget } from '../../Widget';
import { BookmarkAddIcon } from '../../../../capture-ui/Icons';


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
    innerContainer: {
        margin: `0 ${spacersNum.dp16}px ${spacersNum.dp16}px`,
        '&.empty': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
        },
    },
    text: {
        color: colors.grey700,
        fontSize: '14px',
        lineHeight: '19px',
        '&:first-of-type': {
            marginBottom: 0,
        },
    },
    icon: {
        width: `${spacersNum.dp32}px`,
        height: `${spacersNum.dp32}px`,
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
    const [open, setOpen] = useState(true);
    const customTemplates = useMemo(
        () =>
            [...templates].sort(
                ({ sortOrder: orderA, displayName: nameA }, { sortOrder: orderB, displayName: nameB }) => {
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
                },
            ),
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
        <Widget
            header={i18n.t('Saved lists in this program')}
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            <div className={cx(classes.innerContainer, { empty: !customTemplates.length })}>
                {customTemplates.length > 0 ? (
                    <div className={classes.configsContainer}>{configElements}</div>
                ) : (
                    <>
                        <BookmarkAddIcon className={classes.icon} />
                        <p className={classes.text}>
                            {i18n.t('Saved lists offer quick access to your most used views in a program.')}
                        </p>
                        <p className={classes.text}>
                            {i18n.t('There are no saved lists in this program yet, create one using the button below.')}
                        </p>
                    </>
                )}
                <Button small onClick={onCreateTemplate} color="secondary">
                    {i18n.t('Create saved list')}
                </Button>
            </div>
        </Widget>
    );
};

export const TemplateSelector = withStyles(getStyles)(TemplateSelectorPlain);
