import React, { type ComponentType } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { NoWriteAccessMessage } from '../../NoWriteAccessMessage';

const styles: Readonly<any> = {
    buttonRow: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingTop: 10,
        marginLeft: '-8px',
    },
    buttonContainer: {
        paddingRight: 16,
    },
};

type OwnProps = {
    onCancel: () => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

const NoAccessPlain = ({ classes, onCancel }: Props) => (
    <div>
        <NoWriteAccessMessage
            title={i18n.t('New event') as string}
            message={i18n.t("You don't have access to create an event in the current selections") as string}
        />
        <div className={classes.buttonRow}>
            <div className={classes.buttonContainer}>
                <Button
                    primary
                    disabled
                >
                    {i18n.t('Save') as React.ReactNode}
                </Button>
            </div>
            <div className={classes.buttonContainer}>
                <Button
                    secondary
                    onClick={onCancel}
                >
                    {i18n.t('Cancel') as React.ReactNode}
                </Button>
            </div>
        </div>
    </div>
);

export const NoAccess = withStyles(styles)(NoAccessPlain) as ComponentType<OwnProps>;
