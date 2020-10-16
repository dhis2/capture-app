// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button, colors } from '@dhis2/ui';
import { TrackerProgram } from '../../../metaData';

const styles = ({ typography }) => ({
    marginLeft: {
        marginLeft: typography.pxToRem(12),
    },
    buttonAsLink: {
        marginLeft: typography.pxToRem(12),
        fontSize: typography.pxToRem(13),
        background: 'none!important',
        border: 'none',
        padding: '0!important',
        color: colors.grey700,
        textDecoration: 'underline',
        cursor: 'pointer',
    },
});

type Props = $ReadOnly<{|
    selectedProgramId: string,
    onStartAgainClick: () => void,
    onNewClick: () => void,
    onFindClick: () => void,
    showResetButton: boolean,
|}>;

const Index = ({
    onStartAgainClick,
    onNewClick,
    onFindClick,
    selectedProgramId,
    classes,
    showResetButton,
}: Props & CssClasses) => {
    const typeName =
      selectedProgramId instanceof TrackerProgram
          ?
          selectedProgramId.trackedEntityType.name
          :
          'Event';


    return (
        <>
            <Button
                small
                secondary
                dataTest="dhis2-capture-new-event-button"
                onClick={onNewClick}
            >
                {
                    selectedProgramId ?
                        i18n.t('New {{typeName}}', { typeName })
                        :
                        i18n.t('New')
                }
            </Button>
            <Button
                small
                secondary
                dataTest="dhis2-capture-find-button"
                className={classes.marginLeft}
                onClick={onFindClick}
            >
                { i18n.t('Find') }
            </Button>
            {
                showResetButton ?
                    <button
                        className={classes.buttonAsLink}
                        data-test="dhis2-capture-start-again-button"
                        onClick={onStartAgainClick}
                    >
                        { i18n.t('Clear selections') }
                    </button>
                    :
                    null
            }
        </>
    );
};

export const ActionButtons: ComponentType<Props> = withStyles(styles)(Index);
