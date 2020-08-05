// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import SearchIcon from '@material-ui/icons/Search';
import { Button } from '@dhis2/ui-core';
import { TrackerProgram } from '../../../metaData';

export const styles = () => ({
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
    rightButton: {
        marginLeft: 12,
    },
});

type Props = {|
    programId: string,
    dispatchStartAgainClick: () => void,
    dispatchNewClick: () => void,
    dispatchFindClick: () => void,
    showResetButton: boolean,
    ...CssClasses
|};

const Index = ({
    dispatchStartAgainClick,
    dispatchNewClick,
    dispatchFindClick,
    programId,
    classes,
    showResetButton,
}: Props) => {
    const getButtonText = () => {
        if (programId) {
            const typeName = programId instanceof TrackerProgram ?
                programId.trackedEntityType.name :
                'Event';

            return i18n.t('New {{typeName}}', { typeName });
        }
        return i18n.t('New');
    };


    return (
        <div className={classes.container}>
            {
                showResetButton ?
                    <div className={classes.startAgainContainer}>
                        <Button
                            dataTest="dhis2-capture-start-again-button"
                            onClick={dispatchStartAgainClick}
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
                dataTest="dhis2-capture-new-button"
                onClick={dispatchNewClick}
            >
                <AddIcon className={classes.icon} />
                {getButtonText()}
            </Button>
            <Button
                className={classes.rightButton}
                onClick={dispatchFindClick}
                color="primary"
            >
                <SearchIcon />
                { i18n.t('Find') }
            </Button>
        </div>
    );
};

export const ActionButtons = withStyles(styles)(Index);
