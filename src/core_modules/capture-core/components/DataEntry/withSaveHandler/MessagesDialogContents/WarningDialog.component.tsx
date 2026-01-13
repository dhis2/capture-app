import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ModalTitle, ModalContent, ModalActions } from '@dhis2/ui';
import { WithStyles, withStyles } from 'capture-core-utils/styles';

type Props = {
    warnings: Array<{key: string, name?: string, warning: string }>;
    onSave: () => void;
    onAbort: () => void;
};

class WarningDialogPlain extends React.Component<Props & WithStyles<typeof styles>> {
    static getItemWithName(name: string, message: string) {
        return (
            <React.Fragment>
                {name}: {message}
            </React.Fragment>
        );
    }

    static getItemWithoutName(message: string) {
        return (
            <React.Fragment>
                {message}
            </React.Fragment>
        );
    }
    getContents(): Array<React.ReactNode> {
        const { warnings } = this.props;

        return warnings
            .map(warningData => (
                <li
                    key={warningData.key}
                >
                    {warningData.name ?
                        WarningDialogPlain.getItemWithName(warningData.name, warningData.warning) :
                        WarningDialogPlain.getItemWithoutName(warningData.warning)
                    }
                </li>
            ));
    }

    render() {
        const { onAbort, onSave, classes } = this.props;
        return (
            <React.Fragment>
                <ModalTitle>
                    {i18n.t('Validation warnings')}
                </ModalTitle>
                <ModalContent>
                    {this.getContents()}
                </ModalContent>
                <ModalActions>
                    <div style={{ margin: '0 20px 12px 20px' }}>
                        <Button onClick={onAbort} color="primary">
                            {i18n.t('Back to form')}
                        </Button>
                        <Button
                            onClick={onSave}
                            primary
                            initialFocus
                            className={classes.marginLeft}
                        >
                            {i18n.t('Save anyway')}
                        </Button>
                    </div>
                </ModalActions>
            </React.Fragment>
        );
    }
}

const styles = () => ({
    marginLeft: {
        marginLeft: 8,
    },
});
export const WarningDialog = withStyles(styles)(WarningDialogPlain);
