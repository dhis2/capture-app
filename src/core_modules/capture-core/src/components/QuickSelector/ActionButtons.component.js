// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import Tooltip from '@material-ui/core/Tooltip';

//Find button to be included when find(tracked entity instance) is supported
//import SearchIcon from '@material-ui/icons/Search';

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
    buttonWrapper: {
        display: 'inline-block',
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

    render() {
        const { classes, showResetButton } = this.props;

        const hasWriteAccess = this.props.selectedProgram ? programs.get(this.props.selectedProgram).access.data.write : true;
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
                <Tooltip title={!hasWriteAccess ? i18n.t('No write access') : ''}>
                    <div className={classes.buttonWrapper}>
                        <Button
                            onClick={this.handleNewClick}
                            color="primary"
                            disabled={!hasWriteAccess}
                        >
                            <AddIcon className={classes.rightButton} />
                            { i18n.t('New') }
                        </Button>
                    </div>
                </Tooltip>
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
