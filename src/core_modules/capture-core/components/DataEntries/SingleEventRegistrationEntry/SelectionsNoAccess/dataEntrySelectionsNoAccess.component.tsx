import React, { Component } from 'react';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { NoWriteAccessMessage } from '../../../NoWriteAccessMessage';

const getStyles = (theme: any) => ({
    contents: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
    },
    buttonRow: {
        display: 'flex',
        flexWrap: 'wrap',
        paddingTop: 10,
        marginLeft: '-8px',
    },
    buttonContainer: {
        paddingRight: theme.spacing.unit * 2,
    },
}) as const;

type Props = {
    onCancel: () => void;
};

class DataEntrySelectionsNoAccessPlain extends Component<Props & WithStyles<typeof getStyles>> {
    render() {
        const { classes, onCancel } = this.props;
        return (
            <div>
                <NoWriteAccessMessage
                    title={i18n.t('New event')}
                    message={i18n.t("You don't have access to create an event in the current selections")}
                />
                <div
                    className={classes.buttonRow}
                >
                    <div
                        className={classes.buttonContainer}
                    >
                        <Button
                            primary
                            disabled
                        >
                            {i18n.t('Save')}
                        </Button>
                    </div>
                    <div
                        className={classes.buttonContainer}
                    >
                        <Button
                            secondary
                            onClick={onCancel}
                        >
                            {i18n.t('Cancel')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export const DataEntrySelectionsNoAccess = withStyles(getStyles)(DataEntrySelectionsNoAccessPlain);
