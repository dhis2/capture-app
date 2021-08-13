// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Paper } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { DataEntry } from './DataEntry/DataEntry.container';
import type { ProgramStage, RenderFoundation } from '../../../../metaData';
import { useScopeTitleText } from '../../../../hooks/useScopeTitleText';
import { useCurrentProgramInfo } from '../../../../hooks/useCurrentProgramInfo';

const getStyles = ({ typography }) => ({
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
    formFoundation: ?RenderFoundation,
    stage: ?ProgramStage,
}

const NewEventDataEntryWrapperPlain = ({
    classes,
    formFoundation,
    formHorizontal,
    stage,
}: Props) => {
    const { id: programId } = useCurrentProgramInfo();
    const titleText = useScopeTitleText(programId);


    return (
        <Paper className={classes.paper}>
            <div className={classes.title} >
                {i18n.t('New {{titleText}}', {
                    titleText,
                    interpolation: { escapeValue: false },
                })}
            </div>

            <div className={classes.marginLeft}>
                <DataEntry
                    stage={stage}
                    formFoundation={formFoundation}
                    formHorizontal={formHorizontal}
                />
            </div>
        </Paper>
    );
};

export const NewEventDataEntryWrapperComponent = withStyles(getStyles)(NewEventDataEntryWrapperPlain);
