import React, { Component } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { NoWriteAccessMessage } from '../../NoWriteAccessMessage';

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
} & WithStyles<typeof getStyles>;

class NoAccessPlain extends Component<Props> {
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
                            disabled
                        >
                            {i18n.t('Save')}
                        </Button>
                    </div>
                    <div
                        className={classes.buttonContainer}
                    >
                        <Button
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

export const NoAccess = withStyles(getStyles)(NoAccessPlain);
