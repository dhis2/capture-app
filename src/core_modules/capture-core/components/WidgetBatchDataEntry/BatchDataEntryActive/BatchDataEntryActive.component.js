// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { spacers, colors, Button, Tag, Tooltip } from '@dhis2/ui';
import type { PlainProps } from './BatchDataEntryActive.types';
import { Widget } from '../../Widget';

const styles = () => ({
    container: {
        flex: '0.4',
        minWidth: '450px',
        height: 'fit-content',
        border: `2px solid ${colors.yellow300}`,
        borderRadius: '4px',
    },
    content: {
        borderTop: `1px solid ${colors.grey400}`,
        padding: spacers.dp16,
    },
    tag: {
        marginLeft: spacers.dp8,
        backgroundColor: `${colors.yellow300} !important`,
    },
    button: {
        marginTop: spacers.dp8,
    },
});

const BatchDataEntryActiveComponentPlain = ({ title, onBackToBatchDataEntry, classes }: PlainProps) => {
    const text = title.length > 30 ? `${title.substring(0, 27)}...` : title;

    return (
        <div className={classes.container}>
            <Widget header={i18n.t('Batch data entry')} noncollapsible>
                <div className={classes.content}>
                    <div>
                        {i18n.t('Form')}:&nbsp;
                        <Tooltip content={title} placement={'top'} enabled={title.length > 30}>
                            {text}
                        </Tooltip>
                        <Tag className={classes.tag} bold>
                            {i18n.t('Unsaved changes')}
                        </Tag>
                    </div>
                    <Button className={classes.button} onClick={onBackToBatchDataEntry} secondary small>
                        {i18n.t('Back to form')}
                    </Button>
                </div>
            </Widget>
        </div>
    );
};

export const BatchDataEntryActiveComponent = withStyles(styles)(BatchDataEntryActiveComponentPlain);
