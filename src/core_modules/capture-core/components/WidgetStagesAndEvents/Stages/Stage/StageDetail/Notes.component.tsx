import React, { type ComponentType } from 'react';
import { IconMessages16 } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { ApiEnrollmentEvent } from 'capture-core-utils/types/api-types';

type Props = {
    event: ApiEnrollmentEvent;
};

const styles = {
    wrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    text: {
        paddingLeft: '2px',
    },
};
export const NotesPlain = ({ event, classes }: Props & WithStyles<typeof styles>) => {
    const notesCount = event.notes?.length;

    return (
        notesCount ? <div className={classes.wrapper}>
            <IconMessages16 />
            <span className={classes.text}>{notesCount}</span>
        </div> : null
    );
};

export const Notes = withStyles(styles)(NotesPlain) as ComponentType<Props>;
