import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { IncompleteSelectionsMessage } from '../IncompleteSelectionsMessage';

const styles = () => ({
    message: {
        marginTop: 10,
    },
    backButton: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 10,
    },
});

type Props = {
    message: string;
    onBack?: () => void;
};

type PropsWithStyles = Props & WithStyles<typeof styles>;

const NoWriteAccessMessagePlain = ({ message, onBack, classes }: PropsWithStyles) => (
    <div className={classes.message}>
        <IncompleteSelectionsMessage>
            {message}
        </IncompleteSelectionsMessage>
        {onBack && (
            <div className={classes.backButton}>
                <Button
                    dataTest="no-write-access-back-button"
                    onClick={onBack}
                >
                    {i18n.t('Back')}
                </Button>
            </div>
        )}
    </div>
);

export const NoWriteAccessMessage =
  withStyles(styles)(NoWriteAccessMessagePlain) as ComponentType<Props>;
