// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import SearchIcon from '@material-ui/icons/Search';
import { Button } from '@dhis2/ui-core';
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
        fontSize: 20,
    },
    buttonMargin: {
        marginLeft: 8,
    },
    rightButton: {
        marginLeft: 12,
    },
});

type Props = $ReadOnly<{|
    selectedProgramId: string,
    onClickStartAgain: () => void,
    onNewClick: () => void,
    onFindClick: () => void,
    showResetButton: boolean,
    ...CssClasses
|}>;

const Index = ({
    onClickStartAgain,
    onNewClick,
    onFindClick,
    selectedProgramId,
    classes,
    showResetButton,
}: Props) => {
    const typeName =
      selectedProgramId instanceof TrackerProgram
          ?
          selectedProgramId.trackedEntityType.name
          :
          'Event';


    return (
        <div className={classes.container}>
            {
                showResetButton ?
                    <div className={classes.startAgainContainer}>
                        <Button
                            dataTest="dhis2-capture-start-again-button"
                            onClick={onClickStartAgain}
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
                onClick={onNewClick}
            >
                <AddIcon className={classes.icon} />
                <span className={classes.buttonMargin}>
                    {
                        selectedProgramId ?
                            i18n.t('New {{typeName}}', { typeName })
                            :
                            i18n.t('New')
                    }
                </span>
            </Button>
            <Button
                dataTest="dhis2-capture-find-button"
                className={classes.rightButton}
                onClick={onFindClick}
                color="primary"
            >
                <SearchIcon className={classes.icon} />
                <span className={classes.buttonMargin}>
                    { i18n.t('Find') }
                </span>

            </Button>
        </div>
    );
};

export const ActionButtons = withStyles(styles)(Index);
