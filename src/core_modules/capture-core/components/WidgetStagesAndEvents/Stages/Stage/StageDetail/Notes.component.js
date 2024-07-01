// @flow
import React, { type ComponentType } from 'react';
import { IconMessages16 } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';

type Props = {|
    event: ApiEnrollmentEvent,
    ...CssClasses,
|};

const styles = {
    wrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    text: {
        paddingLeft: '2px',
    },
};
export const NotesPlain = ({ event, classes }: Props) => {
    const notesCount = event.notes?.length;

    return (
        notesCount ? <div className={classes.wrapper}>
            <IconMessages16 />
            <span className={classes.text}>{notesCount}</span>
        </div> : null
    );
};

export const Notes: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(NotesPlain);
