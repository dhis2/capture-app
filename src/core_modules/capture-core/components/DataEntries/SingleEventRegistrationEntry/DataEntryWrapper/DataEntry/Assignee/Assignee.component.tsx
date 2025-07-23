import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { UserField } from '../../../../../FormFields/UserField/UserField.component';

const getStyles: any = () => ({
    container: {
        display: 'flex',
        alignItems: 'baseline',
        padding: '8px 8px 8px 12px',
    },
    containerVertical: {
        display: 'flex',
        flexDirection: 'column',
        margin: 8,
    },
    label: {
        flexBasis: 200,
        fontSize: 14,
        paddingLeft: 5,
        color: 'rgba(0, 0, 0, 0.87)',
    },
    field: {
        flexBasis: 150,
        flexGrow: 1,
    },
});

type Props = {
    orientation: string
};

const AssigneePlain = (props: Props & WithStyles<typeof getStyles>) => {
    const { classes, orientation, ...passOnProps } = props;
    return (
        <div className={orientation === 'horizontal' ? classes.container : classes.containerVertical}>
            <div className={orientation === 'horizontal' ? classes.label : undefined}>
                {i18n.t('Assigned user')}
            </div>
            <div className={orientation === 'horizontal' ? classes.field : undefined}>
                <UserField inputPlaceholderText={i18n.t('Search for user')} {...passOnProps} />
            </div>
        </div>);
};

export const Assignee = withStyles(getStyles)(AssigneePlain);
