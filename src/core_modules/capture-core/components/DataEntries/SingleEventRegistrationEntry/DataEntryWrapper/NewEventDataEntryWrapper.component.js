// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Paper } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { Button } from '@dhis2/ui';
import DataEntry from './DataEntry/DataEntry.container';
import EventsList from './RecentlyAddedEventsList/RecentlyAddedEventsList.container';
import type { ProgramStage, RenderFoundation } from '../../../../metaData';
import { useScopeTitleText } from '../../../../hooks/useScopeTitleText';
import { useCurrentProgramInfo } from '../../../../hooks/useCurrentProgramInfo';

const getStyles = ({ typography }) => ({
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flexEnd: {
        justifyContent: 'flex-end',
        marginLeft: 'auto',
    },
    paper: {
        marginBottom: typography.pxToRem(10),
        padding: typography.pxToRem(10),
    },
    title: {
        padding: '8px 0 0px 8px',
        fontWeight: 500,
    },
    marginLeft: {
        marginLeft: 8,
    },
});

type Props = {
    ...CssClasses,
    formHorizontal: ?boolean,
    onFormLayoutDirectionChange: (formHorizontal: boolean) => void,
    formFoundation: ?RenderFoundation,
    stage: ?ProgramStage,
}

const NewEventDataEntryWrapperPlain = ({
    classes,
    formFoundation,
    formHorizontal,
    stage,
    onFormLayoutDirectionChange,
}: Props) => {
    const { id: programId } = useCurrentProgramInfo();
    const titleText = useScopeTitleText(programId);

    return (
        <Paper className={classes.paper}>
            <div className={classes.title} >
                New {titleText}
            </div>

            <div className={classes.flexContainer}>
                <div className={classes.flexEnd}>
                    {
                        !formFoundation || formFoundation.customForm ?
                            null
                            :
                            <Button
                                onClick={() => onFormLayoutDirectionChange(!formHorizontal)}
                                small
                            >
                                {
                                    formHorizontal
                                        ?
                                        i18n.t('Switch to form view')
                                        :
                                        i18n.t('Switch to row view')
                                }
                            </Button>

                    }
                </div>
            </div>
            <div className={classes.marginLeft}>
                <DataEntry
                    stage={stage}
                    formFoundation={formFoundation}
                    formHorizontal={formHorizontal}
                />
                <EventsList />
            </div>
        </Paper>
    );
};

export const NewEventDataEntryWrapperComponent = withStyles(getStyles)(NewEventDataEntryWrapperPlain);
