// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import { Button } from '../../Buttons';
import { TrackerProgram } from '../../../metaData';

const styles = () => ({
    container: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexGrow: 1,
    },
    startAgainContainer: {
        flexGrow: 1,
    },
    icon: {
        paddingRight: 5,
    },
});

type Props = {
    classes: Object,
    selectedProgram: string,
    onStartAgain: () => void,
    onClickNew: () => void,
    showResetButton: boolean,
};

class ActionButtons extends Component<Props> {
    handleClick: () => void;
    handleNewClick: () => void;
    constructor(props) {
        super(props);
        this.handleStartAgainClick = this.handleStartAgainClick.bind(this);
        this.handleNewClick = this.handleNewClick.bind(this);
    }

    handleStartAgainClick = () => {
        this.props.onStartAgain();
    }

    handleNewClick = () => {
        this.props.onClickNew();
    }

    handleFindClick = () => {
        alert('Not implemented yet.');
    }

    getButtonText = () => {
        if (this.props.selectedProgram) {
            const typeName = this.props.selectedProgram instanceof TrackerProgram ?
                this.props.selectedProgram.trackedEntityType.name :
                'Event';

            return i18n.t('New {{typeName}}', { typeName });
        }
        return i18n.t('New');
    }

    render() {
        const { classes, showResetButton } = this.props;

        return (
            <div className={classes.container}>
                {
                    showResetButton ?
                        <div className={classes.startAgainContainer}>
                            <Button
                                onClick={this.handleStartAgainClick}
                                small
                                secondary
                            >
                                { i18n.t('Start again') }
                            </Button>
                        </div>
                        :
                        null
                }
                <Button
                    onClick={this.handleNewClick}
                >
                    <AddIcon                     
                      data-test="new-event-button"
                      className={classes.icon} />
                    {this.getButtonText()}
                </Button>
                {/* Find button to be included when find(tracked entity instance)
                is supported:
                <Button
                    onClick={this.handleFindClick}
                    color="primary"
                >
                    <SearchIcon className={classes.rightButton} />
                    { i18n.t('Find') }
                </Button> */}
            </div>
        );
    }
}

export default withStyles(styles)(ActionButtons);
