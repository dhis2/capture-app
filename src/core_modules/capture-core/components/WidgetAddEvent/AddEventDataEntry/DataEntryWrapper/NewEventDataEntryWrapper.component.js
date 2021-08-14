// @flow

import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { DataEntry } from './DataEntry/DataEntry.container';
import type { ProgramStage, RenderFoundation } from '../../../../metaData';

const getStyles = ({ typography }) => ({
    wrapper: {
        marginBottom: typography.pxToRem(10),
        padding: typography.pxToRem(10),
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
}: Props) => (
    <div className={classes.wrapper}>
        <DataEntry
            stage={stage}
            formFoundation={formFoundation}
            formHorizontal={formHorizontal}
        />
    </div>
);

export const NewEventDataEntryWrapperComponent = withStyles(getStyles)(NewEventDataEntryWrapperPlain);
