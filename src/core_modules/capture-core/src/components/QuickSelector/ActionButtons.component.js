// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import SearchIcon from '@material-ui/icons/Search';

import i18n from '@dhis2/d2-i18n';

const styles = () => ({
    container: {
        flexGrow: 1,
        padding: 10,
        textAlign: 'right',
    },
    leftButton: {
        float: 'left',
    },
    rightButton: {
        marginRight: 5,
    },
});

type Props = {
    classes: Object,
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

    render() {
        const { classes, showResetButton } = this.props;
        return (
            <div className={classes.container}>
                {
                    showResetButton ?
                        <Button
                            onClick={this.handleStartAgainClick}
                            color="primary"
                            className={classes.leftButton}
                        >
                            { i18n.t('Reset') }
                        </Button> :
                        null
                }
                <Button
                    onClick={this.handleNewClick}
                    color="primary"
                >
                    <AddIcon className={classes.rightButton} />
                    { i18n.t('New') }
                </Button>
                {/* Find button to be included when find(tracked entity instance) 
                is supported:
                <Button
                    onClick={this.handleFindClick}
                    color="primary"
                >
                    <SearchIcon className={classes.rightButton} />
                    { i18n.t('Find') }
                </Button>*/}
            </div>
        );
    }
}

export default withStyles(styles)(ActionButtons);
