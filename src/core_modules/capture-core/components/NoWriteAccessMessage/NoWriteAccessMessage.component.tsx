import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { IncompleteSelectionsMessage } from '../IncompleteSelectionsMessage';

const styles = () => ({
    message: {
        marginTop: 10,
    },
});

type Props = {
    message: string;
    onCancel?: () => void;
};

type PropsWithStyles = Props & WithStyles<typeof styles>;

const NoWriteAccessMessagePlain = ({ message, onCancel, classes }: PropsWithStyles) => (
    <div className={classes.message}>
        <IncompleteSelectionsMessage>
            {message}
        </IncompleteSelectionsMessage>
        {onCancel && (
            <Button
                dataTest="no-write-access-cancel-button"
                onClick={onCancel}
            >
                {i18n.t('Cancel')}
            </Button>
        )}
    </div>
);

export const NoWriteAccessMessage =
  withStyles(styles)(NoWriteAccessMessagePlain) as ComponentType<Props>;
