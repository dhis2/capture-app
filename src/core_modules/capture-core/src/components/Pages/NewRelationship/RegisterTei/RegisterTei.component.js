// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import i18n from '@dhis2/d2-i18n';
import DataEntry from './DataEntry/DataEntry.container';
import { RegistrationSection } from './RegistrationSection';
import GeneralOutput from './GeneralOutput/GeneralOutput.container';
import ReviewDialog from './GeneralOutput/WarningSection/SearchGroupDuplicate/ReviewDialog.component';

const getStyles = () => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    leftContainer: {
        flexGrow: 10,
        flexBasis: 0,
        marginTop: 10,
    },
});

type Props = {
    classes: Object,
    onLink: (teiId: string) => void,
    onSave: Function,
    possibleDuplicates: ?boolean,
    tetName: ?string,
    onReviewDuplicates: Function,
};

type State = {
    duplicatesOpen: boolean,
};

class RegisterTei extends React.Component<Props, State> {
    args: Array<any>;
    constructor(props: Props) {
        super(props);
        this.state = {
            duplicatesOpen: false,
        };
    }
    handleSaveAttempt = (...args) => {
        if (this.props.possibleDuplicates) {
            this.args = args;
            this.props.onReviewDuplicates(() => {
                this.setState({
                    duplicatesOpen: true,
                });
            });
        } else {
            this.props.onSave(...args);
        }
    }

    handleSaveFromDialog = () => {
        this.props.onSave(...this.args);
    }

    getSaveButton() {
        return (
            <Button
                onClick={this.handleSaveFromDialog}
                color="primary"
            >
                {i18n.t('Save as new {{tetName}}', { tetName: this.props.tetName })}
            </Button>
        );
    }

    getCancelButton() {
        return (
            <Button onClick={this.handleDialogCancel} color="primary">
                {i18n.t('Cancel')}
            </Button>
        );
    }

    getActions() {
        return (
            <React.Fragment>
                {this.getCancelButton()}
                {this.getSaveButton()}
            </React.Fragment>
        );
    }

    handleDialogCancel = () => {
        this.setState({
            duplicatesOpen: false,
        });
    }

    render() {
        const { onLink, classes } = this.props;
        const { duplicatesOpen } = this.state;

        return (
            <div
                className={classes.container}
            >
                <div
                    className={classes.leftContainer}
                >
                    <RegistrationSection />
                    <DataEntry
                        onLink={onLink}
                        onSave={this.handleSaveAttempt}
                    />
                </div>
                <GeneralOutput
                    onLink={onLink}
                />
                <ReviewDialog
                    open={duplicatesOpen}
                    onLink={onLink}
                    onCancel={this.handleDialogCancel}
                    extraActions={this.getActions()}
                />
            </div>
        );
    }
}

export default withStyles(getStyles)(RegisterTei);
