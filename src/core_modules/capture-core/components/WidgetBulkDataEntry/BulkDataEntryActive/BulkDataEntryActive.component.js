// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { spacers, colors, Button, Tag } from '@dhis2/ui';
import type { PlainProps } from './BulkDataEntryActive.types';
import { Widget } from '../../Widget';

const styles = () => ({
    container: {
        width: '260px',
        minWidth: '260px',
        height: 'fit-content',
        maxHeight: '100vh',
        overflowY: 'scroll',
        border: `2px solid ${colors.yellow200}`,
        borderRadius: '4px',
    },
    content: {
        borderTop: `1px solid ${colors.grey400}`,
        padding: spacers.dp16,
    },
    title: {
        display: 'flex',
    },
    tag: {
        marginLeft: spacers.dp8,
        flexShrink: 0,
        backgroundColor: `${colors.yellow200} !important`,
    },
    button: {
        marginTop: spacers.dp8,
    },
});

const BulkDataEntryActiveComponentPlain = ({ title, onBackToBulkDataEntry, classes }: PlainProps) => (
    <div className={classes.container}>
        <Widget header={i18n.t('Bulk data entry')} noncollapsible borderless>
            <div className={classes.content}>
                <div className={classes.title}>
                    {title}
                    <Tag className={classes.tag}>{i18n.t('Unsaved changes')}</Tag>
                </div>
                <Button className={classes.button} onClick={onBackToBulkDataEntry} secondary small>
                    {i18n.t('Continue data entry')}
                </Button>
            </div>
        </Widget>
    </div>
);

export const BulkDataEntryActiveComponent = withStyles(styles)(BulkDataEntryActiveComponentPlain);
